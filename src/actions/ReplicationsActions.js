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

const entityType = 'replicationcontrollers';

class ReplicationsActions {

  constructor() {
    this.generateActions(
      'scaleReplicationStart',
      'scaleReplicationSuccess',
      'scaleReplicationFailure',
    );
  }

  fetchReplications(cluster) {
    EntitiesActions.fetchEntitiesStart({cluster, entityType});
    return ClustersApi.fetchEntities({cluster, entityType}).then(entities => {
      EntitiesActions.dispatchEntities({cluster, entityType, entities});
      return entities;
    }).catch(() => {
      EntitiesActions.fetchEntitiesFailure({cluster, entityType});
    });
  }

  deleteReplication({cluster, replication}) {
    EntitiesActions.deleteEntityStart({cluster, entity: replication, entityType});
    return ClustersApi.deleteEntity({cluster, entity: replication, entityType}).then(() => {
      EntitiesActions.deleteEntitySuccess({cluster, entity: replication, entityType});
    }).catch(() => {
      EntitiesActions.deleteEntityFailure({cluster, entity: replication, entityType});
    });
  }

  addReplicationLabel({cluster, replication, key, value}) {
    EntitiesActions.addEntityLabelStart({cluster, entity: replication, entityType, key, value});
    return ClustersApi.addEntityLabel({cluster, entity: replication, entityType, key, value}).then(() => {
      EntitiesActions.addEntityLabelSuccess({cluster, entity: replication, entityType, key, value});
    }).catch(() => {
      EntitiesActions.addEntityLabelFailure({cluster, entity: replication, entityType, key, value});
      return Promise.reject();
    });
  }

  deleteReplicationLabel({cluster, replication, key}) {
    EntitiesActions.deleteEntityLabelStart({cluster, entity: replication, entityType, key});
    return ClustersApi.deleteEntityLabel({cluster, entity: replication, entityType, key}).then(() => {
      EntitiesActions.deleteEntityLabelSuccess({cluster, entity: replication, entityType, key});
    }).catch(() => {
      EntitiesActions.deleteEntityLabelFailure({cluster, entity: replication, entityType, key});
    });
  }

  scaleReplication({cluster, replication, replicas}) {
    this.scaleReplicationStart({cluster, replication, replicas});
    return ClustersApi.scaleReplication({cluster, replication, replicas}).then(() => {
      this.scaleReplicationSuccess({cluster, replication, replicas});
    }).catch(() => {
      this.scaleReplicationFailure({cluster, replication, replicas});
    });
  }

  startRollingUpdate() { // {cluster, replication, image}) {
    console.log('Rolling update');
  }
}

export default alt.createActions(ReplicationsActions);
