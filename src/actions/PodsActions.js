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

class PodsActions {

  constructor() {
    this.generateActions(
      'fetchPodLogsStart',
      'fetchPodLogsSuccess',
      'fetchPodLogsFailure',
    );
  }

  fetchPods(cluster) {
    EntitiesActions.fetchEntitiesStart({cluster, entityType: 'pods'});
    return ClustersApi.fetchPods(cluster).then(entities => {
      EntitiesActions.dispatchEntities({cluster, entityType: 'pods', entities});
    })
    .catch(() => {
      EntitiesActions.fetchEntitiesFailure({cluster, entityType: 'pods'});
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
    });
  }

  deletePod({cluster, pod}) {
    EntitiesActions.deleteEntityStart({cluster, entity: pod, entityType: 'pods'});
    return ClustersApi.deletePod({cluster, pod}).then(() => {
      EntitiesActions.deleteEntitySuccess({cluster, entity: pod, entityType: 'pods'});
    }).catch(() => {
      EntitiesActions.deleteEntityFailure({cluster, entity: pod, entityType: 'pods'});
    });
  }

  addPodLabel({cluster, pod, key, value}) {
    EntitiesActions.addEntityLabelStart({cluster, entity: pod, entityType: 'pods', key, value});
    return ClustersApi.addPodLabel({cluster, pod, key, value}).then(() => {
      EntitiesActions.addEntityLabelSuccess({cluster, entity: pod, entityType: 'pods', key, value});
    }).catch(() => {
      EntitiesActions.addEntityLabelFailure({cluster, entity: pod, entityType: 'pods', key, value});
    });
  }

  deletePodLabel({cluster, pod, key}) {
    EntitiesActions.deleteEntityLabelStart({cluster, entity: pod, entityType: 'pods', key});
    return ClustersApi.deletePodLabel({cluster, pod, key}).then(() => {
      EntitiesActions.deleteEntityLabelSuccess({cluster, entity: pod, entityType: 'pods', key});
    }).catch(() => {
      EntitiesActions.deleteEntityLabelFailure({cluster, entity: pod, entityType: 'pods', key});
    });
  }

}

export default alt.createActions(PodsActions);
