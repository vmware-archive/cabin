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

const entityType = 'pods';

class PodsActions {

  constructor() {
    this.generateActions(
      'fetchPodLogsStart',
      'fetchPodLogsSuccess',
      'fetchPodLogsFailure',
      'execPodCommandStart',
      'execPodCommandSuccess',
      'execPodCommandFailure',
    );
  }

  fetchPods(cluster) {
    EntitiesActions.fetchEntitiesStart({cluster, entityType});
    return ClustersApi.fetchEntities({cluster, entityType}).then(entities => {
      EntitiesActions.dispatchEntities({cluster, entityType, entities});
    })
    .catch(() => {
      EntitiesActions.fetchEntitiesFailure({cluster, entityType});
    });
  }

  deletePod({cluster, pod}) {
    EntitiesActions.deleteEntityStart({cluster, entity: pod, entityType});
    return ClustersApi.deleteEntity({cluster, entity: pod, entityType}).then(() => {
      EntitiesActions.deleteEntitySuccess({cluster, entity: pod, entityType});
    }).catch(() => {
      EntitiesActions.deleteEntityFailure({cluster, entity: pod, entityType});
    });
  }

  addPodLabel({cluster, pod, key, value}) {
    EntitiesActions.addEntityLabelStart({cluster, entity: pod, entityType, key, value});
    return ClustersApi.addEntityLabel({cluster, entity: pod, entityType, key, value}).then(() => {
      EntitiesActions.addEntityLabelSuccess({cluster, entity: pod, entityType, key, value});
    }).catch(() => {
      EntitiesActions.addEntityLabelFailure({cluster, entity: pod, entityType, key, value});
      return Promise.reject();
    });
  }

  deletePodLabel({cluster, pod, key}) {
    EntitiesActions.deleteEntityLabelStart({cluster, entity: pod, entityType, key});
    return ClustersApi.deleteEntityLabel({cluster, entity: pod, entityType, key}).then(() => {
      EntitiesActions.deleteEntityLabelSuccess({cluster, entity: pod, entityType, key});
    }).catch(() => {
      EntitiesActions.deleteEntityLabelFailure({cluster, entity: pod, entityType, key});
      return Promise.reject();
    });
  }

  fetchPodLogs({cluster, pod, container}) {
    if (!container && pod.getIn(['spec', 'containers']).size > 0) {
      container = pod.getIn(['spec', 'containers', 0, 'name']);
    }
    this.fetchPodLogsStart({cluster, pod});
    return ClustersApi.fetchPodLogs({cluster, pod, container}).then(logs => {
      this.fetchPodLogsSuccess({cluster, pod, logs});
    })
    .catch(() => {
      this.fetchPodLogsFailure({cluster, pod});
      return Promise.reject();
    });
  }

  execPodCommand({cluster, pod, container, command}) {
    if (!container && pod.getIn(['spec', 'containers']).size > 0) {
      container = pod.getIn(['spec', 'containers', 0, 'name']);
    }
    this.execPodCommandStart({cluster, pod});
    return ClustersApi.execPodCommand({cluster, pod, command, container}).then(messages => {
      this.execPodCommandSuccess({cluster, pod, messages});
    });
  }

  getTillerPod(cluster) {
    return ClustersApi.getTillerPod(cluster);
  }

}

export default alt.createActions(PodsActions);
