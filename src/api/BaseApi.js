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
import { StatusBar, Platform, InteractionManager } from 'react-native';

let REQUESTS_COUNT = 0;

class BaseApi {

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

  static apiFetch({url, method, body, dataUrl, cluster, entity}) {
    this.showNetworkActivityIndicator();
    let headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json',
      'Content-Type': method === 'patch' ? 'application/strategic-merge-patch+json' : 'application/json',
    };

    if (url.indexOf('/exec') !== -1 ) {
      headers = {...headers,
        'Connection': 'Upgrade',
        'Upgrade': 'SPDY/3.1',
        // 'X-Stream-Protocol-Version': 'v2.channel.k8s.io',
        'X-Stream-Protocol-Version': 'channel.k8s.io',
        'Accept': '*/*',
        'Content-Type': '*/*',
      };
    }
    if (cluster && url.indexOf('http') === -1) {
      let path = '';
      if (url.indexOf('/api/v1') === -1 && url.indexOf('/apis/extensions') === -1) {
        let api = '/api/v1';
        if (url.indexOf('/deployments') === 0 || url.indexOf('/ingresses') === 0) {
          api = '/apis/extensions/v1beta1';
        }
        const namespace = entity ? entity.getIn(['metadata', 'namespace']) : cluster.get('currentNamespace');
        path = namespace ? `${api}/namespaces/${namespace}` : api;
      }
      url = `${cluster.get('url')}${path}${url}`;
    }

    if (cluster) {
      if (cluster.get('token')) {
        headers.Authorization = 'Bearer ' + cluster.get('token');
      } else if (cluster.get('username')) {
        headers.Authorization = 'Basic ' + base64.encode(`${cluster.get('username')}:${cluster.get('password')}`);
      }
    }

    if (dataUrl) {
      const params = Qs.stringify(dataUrl, {arrayFormat: 'brackets'});
      url = `${url}?${params}`;
    }
    return fetch(`${url}`, {
      method,
      headers,
      body: JSON.stringify(body),
    }).finally( (response = {}) => {
      this.hideNetworkActivityIndicator();
      if (!response.ok) {
        return this.handleError(response, url);
      }
      // avoid error when the server doesn't return json
      if (response.status === StatusCodes.NO_CONTENT) {
        return {};
      }
      return response.text();
    }).then( (text) => {
      if (typeof text !== 'string' || text.trim() === '') {
        return {};
      }
      return url.indexOf('log') !== -1 ? text : JSON.parse(text);
    }).then( (json) => {
      if (__DEV__ && APP_CONFIG.DEBUG_API) {
        console.log(`[BaseApi ${url}]`, json);
      }
      return new Promise((resolve) => {
        InteractionManager.runAfterInteractions(() => {
          const immutableData = Immutable.fromJS(json);
          resolve(immutableData);
        });
      });
    }).catch((error) => {
      if (cluster.get('url') === 'test') {
        return Promise.resolve();
      }
      return this.handleError(error, url);
    });
  }

  static handleError(error) {
    return Promise.reject({status: BaseApi.getStatus(error), message: error.message});
  }

  static post(url, body = {}, cluster, entity) {
    return this.apiFetch({method: 'post', url, body, cluster, entity});
  }

  static get(url, dataUrl, cluster, entity) {
    return this.apiFetch({method: 'get', url, dataUrl, cluster, entity});
  }

  static put(url, body, cluster, entity) {
    return this.apiFetch({method: 'put', url, body, cluster, entity});
  }

  static patch(url, body, cluster, entity) {
    return this.apiFetch({method: 'patch', url, body, cluster, entity});
  }

  static delete(url, body, cluster, entity) {
    return this.apiFetch({method: 'delete', url, body, cluster, entity});
  }

  static getStatus(response) {
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

}

export default BaseApi;
