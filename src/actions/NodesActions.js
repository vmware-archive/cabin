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

class NodesActions {

  constructor() {
    this.generateActions(

    );
  }

  fetchNodes(cluster) {
    EntitiesActions.fetchEntitiesStart({cluster, entityType: 'nodes'});
    return ClustersApi.fetchNodes(cluster).then(entities => {
      EntitiesActions.dispatchEntities({cluster, entityType: 'nodes', entities});
    })
    .catch(() => {
      EntitiesActions.fetchEntitiesFailure({cluster, entityType: 'nodes'});
    });
  }

  deleteNode({cluster, node}) {
    EntitiesActions.deleteEntityStart({cluster, entity: node, entityType: 'nodes'});
    return ClustersApi.deleteNode({cluster, node}).then(() => {
      EntitiesActions.deleteEntitySuccess({cluster, entity: node, entityType: 'nodes'});
    }).catch(() => {
      EntitiesActions.deleteEntityFailure({cluster, entity: node, entityType: 'nodes'});
    });
  }

  addNodeLabel({cluster, node, key, value}) {
    EntitiesActions.addEntityLabelStart({cluster, entity: node, entityType: 'nodes', key, value});
    return ClustersApi.addNodeLabel({cluster, node, key, value}).then(() => {
      EntitiesActions.addEntityLabelSuccess({cluster, entity: node, entityType: 'nodes', key, value});
    }).catch(() => {
      EntitiesActions.addEntityLabelFailure({cluster, entity: node, entityType: 'nodes', key, value});
    });
  }

  deleteNodeLabel({cluster, node, key}) {
    EntitiesActions.deleteEntityLabelStart({cluster, entity: node, entityType: 'nodes', key});
    return ClustersApi.deleteNodeLabel({cluster, node, key}).then(() => {
      EntitiesActions.deleteEntityLabelSuccess({cluster, entity: node, entityType: 'nodes', key});
    }).catch(() => {
      EntitiesActions.deleteEntityLabelFailure({cluster, entity: node, entityType: 'nodes', key});
    });
  }
}

export default alt.createActions(NodesActions);
