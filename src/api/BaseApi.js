/*
  Copyright 2015 Skippbox, Ltd

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import StatusCodes from 'utils/StatusCodes';
import Qs from 'qs';
import base64 from 'base-64';
import {
  StatusBar,
  Platform,
  InteractionManager,
  NativeModules,
} from 'react-native';
import YAML from 'js-yaml';
import RNFetchBlob from 'react-native-fetch-blob';
import ClustersUtils from 'utils/ClustersUtils';
const { GRPCManager: grpc } = NativeModules;
import alt from 'src/alt';
import FakeData from 'stores/FakeData';

const httpFetch = fetch;
if (NativeModules.SKPNetwork) {
  httpFetch = NativeModules.SKPNetwork.fetch;
}

let REQUESTS_COUNT = 0;
let currentWatch = null;
class BaseApi {
  // GRPC
  static deployChart({ chart, service, cluster }) {
    const host = ClustersUtils.hostForCluster({ cluster, service });
    return grpc.deployChartAtURL(chart.get('url'), host).catch(e => {
      console.log('ERROR DEPLOY', e);
      return Promise.reject(e);
    });
  }

  // GRPC
  static fetchReleases({ cluster, service }) {
    const host = ClustersUtils.hostForCluster({ cluster, service });
    return grpc
      .fetchReleasesForHost(host)
      .then(r => {
        return Immutable.fromJS(r);
      })
      .catch(e => {
        return Promise.reject(e);
      });
  }

  // GRPC
  static deleteRelease({ cluster, service, release }) {
    const host = ClustersUtils.hostForCluster({ cluster, service });
    return grpc.deleteRelease(release.get('name'), host);
  }

  static showNetworkActivityIndicator() {
    REQUESTS_COUNT++;
    if (Platform.OS === 'ios') {
      StatusBar.setNetworkActivityIndicatorVisible(true);
    }
  }

  static hideNetworkActivityIndicator() {
    REQUESTS_COUNT--;
    if (Platform.OS === 'ios' && REQUESTS_COUNT === 0) {
      StatusBar.setNetworkActivityIndicatorVisible(false);
    }
  }

  static websocket({ url, body, dataUrl, cluster, entity, onMessage }) {
    const { url: URL, headers: defaultHeaders } = this.updateParams({
      url,
      body,
      dataUrl,
      cluster,
      entity,
    });
    const headers = { Authorization: defaultHeaders.Authorization };
    if (cluster.get('certificate')) {
      headers['auth-certificate'] = cluster.getIn(['certificate', 'path']);
      headers['auth-password'] = cluster.getIn(['certificate', 'password']);
    }
    if (currentWatch) {
      currentWatch.close(0, 'Closing manually before another connection');
    }
    return new Promise(resolve => {
      let messages = Immutable.List();
      currentWatch = new WebSocket(URL, null, headers);
      currentWatch.onopen = () => {};
      currentWatch.onmessage = e => {
        const data = BaseApi.readData(e.data);
        onMessage && onMessage(data);
        messages = messages.push(data);
      };
      currentWatch.onerror = () => {};
      currentWatch.onclose = () => {
        resolve(messages);
      };
    });
  }

  static readData(data) {
    try {
      const object = JSON.parse(data);
      return Immutable.fromJS(object);
    } catch (e) {
      const buffer = data;
      const arr = new Uint8Array(buffer);
      const str = String.fromCharCode.apply(String, arr);
      if (/[\u0080-\uffff]/.test(str)) {
        throw new Error(
          'this string seems to contain (still encoded) multibytes'
        );
      }
      return str;
    }
  }

  static handleNetworkResponse(response, url) {
    if (typeof response.text !== 'function') {
      const t = response.text;
      response.text = () =>
        new Promise(resolve => {
          resolve(t);
        });
    }
    if (!response.ok) {
      return response.text().then(t => {
        return this.handleError(BaseApi.parseJSON(t));
      });
    }
    // avoid error when the server doesn't return json
    if (response.status === StatusCodes.NO_CONTENT) {
      return {};
    }
    return response
      .text()
      .then(text => {
        if (typeof text !== 'string' || text.trim() === '') {
          return {};
        }
        if (url.indexOf('/log?') !== -1) {
          return text;
        }

        const json = BaseApi.parseJSON(text);
        if (json) {
          return json;
        }
        const yaml = BaseApi.parseYAML(text);
        if (yaml) {
          return yaml;
        }
        return text;
      })
      .then(json => {
        if (json.error) {
          return this.handleError(json.error);
        }
        if (__DEV__ && !APP_CONFIG.DEBUG_API) {
          console.log(`[BaseApi ${URL}]`, json);
        }
        return new Promise(resolve => {
          InteractionManager.runAfterInteractions(() => {
            const immutableData = Immutable.fromJS(json);
            resolve(immutableData);
          });
        });
      })
      .catch(error => {
        return this.handleError(error, url);
      });
  }

  static apiFetch({ url, method, body, dataUrl, cluster, entity }) {
    this.showNetworkActivityIndicator();
    const { url: URL, headers } = this.updateParams({
      url,
      method,
      body,
      dataUrl,
      cluster,
      entity,
    });
    if (cluster && FakeData.getIn(['ClustersStore', cluster.get('url')])) {
      return Promise.resolve();
    }
    return httpFetch(URL, {
      method,
      headers,
      body: _.isEmpty(body) ? undefined : JSON.stringify(body),
      certificate: cluster && cluster.get('certificate')
        ? cluster.get('certificate').toJS()
        : undefined,
    }).finally((response = {}) => {
      this.hideNetworkActivityIndicator();
      return this.handleNetworkResponse(response, URL);
    });
  }

  static fetchFile(url, headers = {}) {
    this.showNetworkActivityIndicator();
    return RNFetchBlob.fetch('GET', url, headers)
      .then(response => {
        this.hideNetworkActivityIndicator();
        const text = response.text();
        let obj = {};
        const json = BaseApi.parseJSON(text);
        if (json) {
          obj = json;
        }
        const yaml = BaseApi.parseYAML(text);
        if (yaml) {
          obj = yaml;
        }
        return Immutable.fromJS(obj);
      })
      .catch(error => {
        this.hideNetworkActivityIndicator();
        return this.handleError(error, url);
      });
  }

  static parseJSON(text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  }

  static parseYAML(text) {
    try {
      // text = text.replace('  platforms.', '');// FIXME: Remove this
      return YAML.load(text);
    } catch (e) {
      return null;
    }
  }

  static handleError(error) {
    return Promise.reject({
      status: BaseApi.getStatus(error),
      message: error.message,
    });
  }

  static post(url, body = {}, cluster, entity) {
    return this.apiFetch({ method: 'post', url, body, cluster, entity });
  }

  static get(url, dataUrl, cluster, entity) {
    return this.apiFetch({ method: 'get', url, dataUrl, cluster, entity });
  }

  static put(url, body, cluster, entity) {
    return this.apiFetch({ method: 'put', url, body, cluster, entity });
  }

  static patch(url, body, cluster, entity) {
    return this.apiFetch({ method: 'patch', url, body, cluster, entity });
  }

  static delete(url, body, cluster, entity) {
    return this.apiFetch({ method: 'delete', url, body, cluster, entity });
  }

  static getStatus(response = {}) {
    let status;
    switch (response.status) {
      case StatusCodes.PAYMENT_REQUIRED:
        status = 'payment-required';
        break;
      case StatusCodes.NOT_FOUND:
        status = 'not-found';
        break;
      case StatusCodes.UNAVAILABLE:
        status = 'unavailable';
        break;
      default:
        status = 'failure';
    }
    return status;
  }

  static updateParams({ url, method, dataUrl, cluster, entity }) {
    const headers = {
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'application/json',
      'Content-Type': method === 'patch'
        ? 'application/strategic-merge-patch+json'
        : 'application/json',
    };
    if (cluster && url.indexOf('http') === -1) {
      let path = '';
      if (
        url.indexOf('/api/v1') === -1 &&
        url.indexOf('/apis/extensions') === -1
      ) {
        let api = '/api/v1';
        if (
          url.indexOf('/deployments') === 0 ||
          url.indexOf('/ingresses') === 0 ||
          url.indexOf('/replicasets') === 0
        ) {
          api = '/apis/extensions/v1beta1';
        }
        let namespace;
        if (url.indexOf('/nodes') === -1) {
          namespace = entity
            ? entity.getIn(['metadata', 'namespace'])
            : cluster.get('currentNamespace');
        }
        path = namespace ? `${api}/namespaces/${namespace}` : api;
      }
      url = `${cluster.get('url')}${path}${url}`;
    }

    if (cluster) {
      if (cluster.get('token')) {
        headers.Authorization = 'Bearer ' + cluster.get('token');
      } else if (cluster.get('username')) {
        headers.Authorization =
          'Basic ' +
          base64.encode(
            `${cluster.get('username')}:${cluster.get('password')}`
          );
      }
    }
    const user = alt.stores.GoogleCloudStore.getUser();
    if (user && url.indexOf('googleapis.com') !== -1) {
      headers.Authorization = `Bearer ${user.get('accessToken')}`;
    }

    if (dataUrl && Object.keys(dataUrl).length !== 0) {
      const params = Qs.stringify(dataUrl, { arrayFormat: 'repeat' });
      url = `${url}?${params}`;
    }
    return { url, headers };
  }
}

export default BaseApi;
