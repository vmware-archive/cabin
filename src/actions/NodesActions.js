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
import PodsActions from 'actions/PodsActions';
import SnackbarUtils from 'utils/SnackbarUtils';

const entityType = 'nodes';

class NodesActions {

  constructor() {
    this.generateActions(
      'setSchedulableStart',
      'setSchedulableSuccess',
      'setSchedulableFailure',
      'putInMaintenanceStart',
      'putInMaintenanceSuccess',
      'putInMaintenanceFailure',
    );
  }

  fetchNodes(cluster) {
    return EntitiesActions.fetchEntities({cluster, entityType});
  }

  deleteNode({cluster, node}) {
    EntitiesActions.deleteEntityStart({cluster, entity: node, entityType});
    return ClustersApi.deleteNode({cluster, node}).then(() => {
      EntitiesActions.deleteEntitySuccess({cluster, entity: node, entityType});
    }).catch(() => {
      EntitiesActions.deleteEntityFailure({cluster, entity: node, entityType});
    });
  }

  addNodeLabel({cluster, node, key, value}) {
    EntitiesActions.addEntityLabelStart({cluster, entity: node, entityType, key, value});
    return ClustersApi.addNodeLabel({cluster, node, key, value}).then(() => {
      EntitiesActions.addEntityLabelSuccess({cluster, entity: node, entityType, key, value});
    }).catch(() => {
      EntitiesActions.addEntityLabelFailure({cluster, entity: node, entityType, key, value});
    });
  }

  deleteNodeLabel({cluster, node, key}) {
    EntitiesActions.deleteEntityLabelStart({cluster, entity: node, entityType, key});
    return ClustersApi.deleteNodeLabel({cluster, node, key}).then(() => {
      EntitiesActions.deleteEntityLabelSuccess({cluster, entity: node, entityType, key});
    }).catch(() => {
      EntitiesActions.deleteEntityLabelFailure({cluster, entity: node, entityType, key});
    });
  }

  setSchedulable({cluster, node, schedulable}) {
    this.setSchedulableStart({cluster, node, schedulable});
    return ClustersApi.setSchedulable({cluster, node, schedulable}).then(() => {
      this.setSchedulableSuccess({cluster, node, schedulable});
    }).catch(() => {
      this.setSchedulableFailure({cluster, node, schedulable});
    });
  }

  putInMaintenance({cluster, node}) {
    return this.setSchedulable({cluster, node, schedulable: false}).then(() => {
      this.putInMaintenanceStart({cluster, node});
      return ClustersApi.getNodePods({cluster, node});
    }).then((pods) => {
      return Promise.all(pods.map(pod => PodsActions.deletePod({cluster, pod})));
    }).then(() => {
      this.putInMaintenanceSuccess({cluster, node});
    }).catch(() => {
      SnackbarUtils.showError();
      this.putInMaintenanceFailure({cluster, node});
    });
  }
}

export default alt.createActions(NodesActions);
