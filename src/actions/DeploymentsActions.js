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
import EntitiesUtils from 'utils/EntitiesUtils';

const entityType = 'deployments';

class DeploymentsActions {

  constructor() {
    this.generateActions(
      'scaleDeploymentStart',
      'scaleDeploymentSuccess',
      'scaleDeploymentFailure',
    );
  }

  fetchDeployments(cluster) {
    EntitiesActions.fetchEntitiesStart({cluster, entityType});
    return ClustersApi.fetchEntities({cluster, entityType}).then(entities => {
      EntitiesActions.dispatchEntities({cluster, entityType, entities});
    })
    .catch(() => {
      EntitiesActions.fetchEntitiesFailure({cluster, entityType});
    });
  }

  deleteDeployment({cluster, deployment}) {
    EntitiesActions.deleteEntityStart({cluster, entity: deployment, entityType});
    return ClustersApi.deleteEntity({cluster, entity: deployment, entityType}).then(() => {
      EntitiesActions.deleteEntitySuccess({cluster, entity: deployment, entityType});
    }).catch(() => {
      EntitiesActions.deleteEntityFailure({cluster, entity: deployment, entityType});
    });
  }

  createDeployment({cluster, name, image}) {
    const params = EntitiesUtils.newDeploymentParams({name, image});
    return EntitiesActions.createEntity({cluster, params, entityType});
  }

  addDeploymentLabel({cluster, deployment, key, value}) {
    EntitiesActions.addEntityLabelStart({cluster, entity: deployment, entityType, key, value});
    return ClustersApi.addEntityLabel({cluster, entity: deployment, entityType, key, value}).then(() => {
      EntitiesActions.addEntityLabelSuccess({cluster, entity: deployment, entityType, key, value});
    }).catch(() => {
      EntitiesActions.addEntityLabelFailure({cluster, entity: deployment, entityType, key, value});
      return Promise.reject();
    });
  }

  deleteDeploymentLabel({cluster, deployment, key}) {
    EntitiesActions.deleteEntityLabelStart({cluster, entity: deployment, entityType, key});
    return ClustersApi.deleteEntityLabel({cluster, entity: deployment, entityType, key}).then(() => {
      EntitiesActions.deleteEntityLabelSuccess({cluster, entity: deployment, entityType, key});
    }).catch(() => {
      EntitiesActions.deleteEntityLabelFailure({cluster, entity: deployment, entityType, key});
    });
  }

  scaleDeployment({cluster, deployment, replicas}) {
    this.scaleDeploymentStart({cluster, deployment, replicas});
    return ClustersApi.scaleDeployment({cluster, deployment, replicas}).then(() => {
      this.scaleDeploymentSuccess({cluster, deployment, replicas});
    }).catch(() => {
      this.scaleDeploymentFailure({cluster, deployment, replicas});
    });
  }
}

export default alt.createActions(DeploymentsActions);
