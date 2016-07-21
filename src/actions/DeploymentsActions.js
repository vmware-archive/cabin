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

class DeploymentsActions {

  constructor() {
    this.generateActions(
      'fetchDeploymentsStart',
      'fetchDeploymentsSuccess',
      'fetchDeploymentsFailure',
      'deleteDeploymentStart',
      'deleteDeploymentSuccess',
      'deleteDeploymentFailure',
      'addDeploymentLabelStart',
      'addDeploymentLabelSuccess',
      'addDeploymentLabelFailure',
      'deleteDeploymentLabelStart',
      'deleteDeploymentLabelSuccess',
      'deleteDeploymentLabelFailure',
      'scaleDeploymentStart',
      'scaleDeploymentSuccess',
      'scaleDeploymentFailure',
    );
  }

  fetchDeployments(cluster) {
    this.fetchDeploymentsStart(cluster);
    return ClustersApi.fetchDeployments(cluster).then(deployments => {
      this.fetchDeploymentsSuccess({cluster, deployments});
    })
    .catch(() => {
      this.fetchDeploymentsFailure(cluster);
    });
  }

  deleteDeployment({cluster, deployment}) {
    this.deleteDeploymentStart({cluster, deployment});
    return ClustersApi.deleteDeployment({cluster, deployment}).then(() => {
      this.deleteDeploymentSuccess({cluster, deployment});
    }).catch(() => {
      this.deleteDeploymentFailure({cluster, deployment});
    });
  }

  addDeploymentLabel({cluster, deployment, key, value}) {
    this.addDeploymentLabelStart({cluster, deployment, key, value});
    return ClustersApi.addDeploymentLabel({cluster, deployment, key, value}).then(() => {
      this.addDeploymentLabelSuccess({cluster, deployment, key, value});
    }).catch(() => {
      this.addDeploymentLabelFailure({cluster, deployment, key, value});
    });
  }

  deleteDeploymentLabel({cluster, deployment, key}) {
    this.deleteDeploymentLabelStart({cluster, deployment, key});
    return ClustersApi.deleteDeploymentLabel({cluster, deployment, key}).then(() => {
      this.deleteDeploymentLabelSuccess({cluster, deployment, key});
    }).catch(() => {
      this.deleteDeploymentLabelFailure({cluster, deployment, key});
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
