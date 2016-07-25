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
import ClustersApi from 'api/ClustersApi';
import EntitiesActions from 'actions/EntitiesActions';

class ClustersActions {

  constructor() {
    this.generateActions(
      'checkClusterStart',
      'checkClusterSuccess',
      'addCluster',
      'editCluster',
      'removeCluster',
      'setCurrentNamespace',
      'fetchNamespacesSuccess',
    );
  }

  checkClusters() {
    return Promise.all(alt.stores.ClustersStore.getClusters().map(cluster => {
      return this.checkCluster(cluster);
    }));
  }

  checkCluster(cluster) {
    this.checkClusterStart(cluster);
    return ClustersApi.checkCluster(cluster).then(up => {
      this.checkClusterSuccess({cluster, up});
    });
  }

  fetchAllClustersEntities() {
    return Promise.all(alt.stores.ClustersStore.getClusters().map(cluster => {
      return this.fetchClusterEntities(cluster);
    }));
  }

  fetchClusterEntities(cluster) {
    alt.stores.SettingsStore.getEntitiesToDisplay().map(entity => {
      EntitiesActions.fetchEntities.defer({cluster, entityType: entity.get('name')});
    });
  }

  fetchNamespaces(cluster) {
    ClustersApi.fetchNamespaces(cluster).then(namespaces => {
      this.fetchNamespacesSuccess({cluster, namespaces});
    });
  }

}

export default alt.createActions(ClustersActions);
