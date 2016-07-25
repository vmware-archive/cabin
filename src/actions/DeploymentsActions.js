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

class DeploymentsActions {

  constructor() {
    this.generateActions(
      'scaleDeploymentStart',
      'scaleDeploymentSuccess',
      'scaleDeploymentFailure',
    );
  }

  fetchDeployments(cluster) {
    EntitiesActions.fetchEntitiesStart({cluster, entityType: 'deployments'});
    return ClustersApi.fetchDeployments(cluster).then(entities => {
      EntitiesActions.dispatchEntities({cluster, entityType: 'deployments', entities});
    })
    .catch(() => {
      EntitiesActions.fetchEntitiesFailure({cluster, entityType: 'deployments'});
    });
  }

  deleteDeployment({cluster, deployment}) {
    EntitiesActions.deleteEntityStart({cluster, entity: deployment, entityType: 'deployments'});
    return ClustersApi.deleteDeployment({cluster, deployment}).then(() => {
      EntitiesActions.deleteEntitySuccess({cluster, entity: deployment, entityType: 'deployments'});
    }).catch(() => {
      EntitiesActions.deleteEntityFailure({cluster, entity: deployment, entityType: 'deployments'});
    });
  }

  addDeploymentLabel({cluster, deployment, key, value}) {
    EntitiesActions.addEntityLabelStart({cluster, entity: deployment, entityType: 'deployments', key, value});
    return ClustersApi.addDeploymentLabel({cluster, deployment, key, value}).then(() => {
      EntitiesActions.addEntityLabelSuccess({cluster, entity: deployment, entityType: 'deployments', key, value});
    }).catch(() => {
      EntitiesActions.addEntityLabelFailure({cluster, entity: deployment, entityType: 'deployments', key, value});
    });
  }

  deleteDeploymentLabel({cluster, deployment, key}) {
    EntitiesActions.deleteEntityLabelStart({cluster, entity: deployment, entityType: 'deployments', key});
    return ClustersApi.deleteDeploymentLabel({cluster, deployment, key}).then(() => {
      EntitiesActions.deleteEntityLabelSuccess({cluster, entity: deployment, entityType: 'deployments', key});
    }).catch(() => {
      EntitiesActions.deleteEntityLabelFailure({cluster, entity: deployment, entityType: 'deployments', key});
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
