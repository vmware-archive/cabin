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
import EntitiesActions from 'actions/EntitiesActions';
import ClustersApi from 'api/ClustersApi';
import EntitiesUtils from 'utils/EntitiesUtils';

const entityType = 'horizontalpodautoscalers';

class HorizontalPodAutoscalersActions {
  constructor() {
    this.generateActions();
  }

  fetchHorizontalPodAutoscalers(cluster) {
    return EntitiesActions.fetchEntities({ cluster, entityType });
  }

  createHPA({ cluster, deployment, name, min, max }) {
    const params = EntitiesUtils.newHPAParams({ deployment, name, min, max });
    return EntitiesActions.createEntity({
      cluster,
      entityType,
      params,
      namespace: deployment.getIn(['metadata', 'namespace']),
    });
  }

  updateSpec({ cluster, hpa, spec }) {
    return ClustersApi.updateHPASpec({ cluster, hpa, spec });
  }
}

export default alt.createActions(HorizontalPodAutoscalersActions);
