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
import alt from 'src/alt';

class SearchActions {

  constructor() {
    this.generateActions(
      'searchEntitiesSuccess',
    );
  }

  searchEntities({cluster, query}) {
    query = query.toLowerCase();
    const filter = (e) => {
      let match = e.getIn(['metadata', 'name']).toLowerCase().indexOf(query) !== -1;
      if (match) { return true; }
      e.getIn(['metadata', 'labels'], Immutable.List()).some((label, key) => {
        if (label.toLowerCase().indexOf(query) !== -1 || key.toLowerCase().indexOf(query) !== -1) {
          match = true;
          return true; // break
        }
        return false;
      });
      return match;
    };
    const pods = alt.stores.PodsStore.getAll(cluster).take(5).filter(filter);
    const nodes = alt.stores.NodesStore.getAll(cluster).take(5).filter(filter);
    const services = alt.stores.ServicesStore.getAll(cluster).take(5).filter(filter);
    const replicationcontrollers = alt.stores.ReplicationsStore.getAll(cluster).take(5).filter(filter);
    const deployments = alt.stores.DeploymentsStore.getAll(cluster).take(5).filter(filter);
    const ingresses = alt.stores.IngressesStore.getAll(cluster).take(5).filter(filter);
    const replicasets = alt.stores.ReplicaSetsStore.getAll(cluster).take(5).filter(filter);
    const secrets = alt.stores.SecretsStore.getAll(cluster).take(5).filter(filter);
    const serviceaccounts = alt.stores.ServiceAccountsStore.getAll(cluster).take(5).filter(filter);
    const volumeclaims = alt.stores.VolumeClaimsStore.getAll(cluster).take(5).filter(filter);
    const volumes = alt.stores.VolumesStore.getAll(cluster).take(5).filter(filter);
    return {cluster, query, result: Immutable.fromJS({
      pods, nodes, services, replicationcontrollers, deployments,
      ingresses, replicasets, secrets, serviceaccounts, volumeclaims, volumes,
    })};
  }
}

export default alt.createActions(SearchActions);
