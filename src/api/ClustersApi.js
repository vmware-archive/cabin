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
import BaseApi from './BaseApi';

class ClustersApi {

  static checkCluster(cluster) {
    return BaseApi.get(`${cluster.get('url')}/api/v1`, {}, cluster)
      .then(() => Promise.resolve(true))
      .catch(() => Promise.resolve(false));
  }

  static fetchPods(cluster) {
    return BaseApi.get(`${cluster.get('url')}/api/v1/pods`, {}, cluster).then((response) => {
      return response.get('items');
    });
  }

  static fetchReplications(cluster) {
    return BaseApi.get(`${cluster.get('url')}/api/v1/replicationcontrollers`, {}, cluster).then((response) => {
      return response.get('items');
    });
  }

  static fetchServices(cluster) {
    return BaseApi.get(`${cluster.get('url')}/api/v1/services`, {}, cluster).then((response) => {
      return response.get('items');
    });
  }

}

export default ClustersApi;
