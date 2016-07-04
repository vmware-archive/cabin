import BaseApi from './BaseApi';

class NodesApi {

  static fetchNodes(endpoint) {
    const authentication = {username: endpoint.get('username'), password: endpoint.get('password')};
    return BaseApi.get(`${endpoint.get('url')}/api/v1/nodes`, {}, authentication).then((response) => {
      return response.get('items');
    });
  }

}

export default NodesApi;
