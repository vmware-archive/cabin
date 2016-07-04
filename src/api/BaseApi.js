import StatusCodes from 'utils/StatusCodes';
import Qs from 'qs';
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

  static apiFetch({url, method, body, dataUrl, authentication}) {
    this.showNetworkActivityIndicator();
    const headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (authentication) {
      headers.Authorization = 'Basic ' + btoa(`${authentication.username}:${authentication.password}`);
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
      return JSON.parse(text);
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
      return this.handleError(error, url);
    });
  }

  static handleError(error) {
    console.log(error);
    return Promise.reject({status: BaseApi.getStatus(error), message: error.message});
  }

  static post(url, body = {}) {
    return this.apiFetch({method: 'post', url, body});
  }

  static get(url, dataUrl, authentication) {
    return this.apiFetch({method: 'get', url, dataUrl, authentication});
  }

  static put(url, body) {
    return this.apiFetch({method: 'put', url, body});
  }

  static delete(url, body) {
    return this.apiFetch({method: 'delete', url, body});
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
