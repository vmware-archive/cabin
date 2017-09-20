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
import ReleasesActions from 'actions/ReleasesActions';

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
      'createNamespaceStart',
      'createNamespaceSuccess',
      'createNamespaceFailure'
    );
  }

  checkClusters() {
    return Promise.all(
      alt.stores.ClustersStore.getClusters().map(cluster => {
        return this.checkCluster(cluster);
      })
    );
  }

  checkCluster(cluster) {
    this.checkClusterStart(cluster);
    return ClustersApi.checkCluster(cluster).then(({ up, response }) => {
      this.checkClusterSuccess({ cluster, up, response });
    });
  }

  fetchAllClustersEntities() {
    return Promise.all(
      alt.stores.ClustersStore.getClusters().map(cluster => {
        return this.fetchClusterEntities(cluster);
      })
    );
  }

  fetchClusterEntities(cluster) {
    alt.stores.SettingsStore.getEntitiesToDisplay().map(entity => {
      if (entity.get('name') === 'helmreleases') {
        setTimeout(() => {
          ReleasesActions.fetchReleases.defer(cluster);
        }, 2000);
      } else {
        EntitiesActions.fetchEntities.defer({
          cluster,
          entityType: entity.get('name'),
        });
      }
    });
  }

  fetchNamespaces(cluster) {
    return ClustersApi.fetchNamespaces(cluster).then(namespaces => {
      this.fetchNamespacesSuccess({ cluster, namespaces });
    });
  }

  createNamespace({ cluster, namespace }) {
    this.createNamespaceStart({ cluster, namespace });
    return ClustersApi.createNamespace({ cluster, namespace })
      .then(() => {
        this.createNamespaceSuccess({ cluster, namespace });
      })
      .catch(e => {
        this.createNamespaceFailure({ cluster, e });
        return Promise.reject(e);
      });
  }
}

export default alt.createActions(ClustersActions);
