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
import InitActions from 'actions/InitActions';
import DeploymentsActions from 'actions/DeploymentsActions';
import Immutable from 'immutable';
import immutableUtil from 'alt-utils/lib/ImmutableUtil';
import FakeData from './FakeData';

class DeploymentsStore {

  constructor() {
    this.bindActions(InitActions);
    this.bindActions(DeploymentsActions);
    if (__DEV__ && FakeData.get(this.displayName)) {
      this.state = FakeData.get(this.displayName);
    } else {
      this.state = Immutable.fromJS({
        deployments: {},
        status: {},
      });
    }
  }

  onInitAppSuccess(appState) {
    if (appState.get(this.displayName)) {
      this.setState(this.state.mergeDeep(appState.get(this.displayName)));
      return true;
    }
    return false;
  }

  onFetchDeploymentsStart(cluster) {
    this.setState(this.state.setIn(['status', cluster.get('url')], 'loading'));
  }

  onFetchDeploymentsSuccess({cluster, deployments}) {
    this.setState(
      this.state.setIn(['deployments', cluster.get('url')], deployments.map(e => e.set('kind', 'deployments')))
      .setIn(['status', cluster.get('url')], 'success')
    );
  }

  onFetchDeploymentsFailure(cluster) {
    const deployments = alt.stores.DeploymentsStore.getDeployments(cluster);
    this.setState(this.state.setIn(['status', cluster.get('url')], deployments.size === 0 ? 'failure' : 'success'));
  }

  onDeleteDeploymentStart({cluster, deployment}) {
    this.setState(this.state.updateIn(['deployments', cluster.get('url')], deployments => {
      return deployments.filter(p => p.getIn(['metadata', 'name']) !== deployment.getIn(['metadata', 'name']));
    }));
  }

  onAddDeploymentLabelStart({cluster, deployment, key, value}) {
    const index = this.state.getIn(['deployments', cluster.get('url')]).findIndex(e => {
      return e.getIn(['metadata', 'name']) === deployment.getIn(['metadata', 'name']);
    });
    this.setState(this.state.setIn(['deployments', cluster.get('url'), index, 'metadata', 'labels', key], value));
  }

  onAddDeploymentLabelFailure({cluster, deployment, key}) {
    const index = this.state.getIn(['deployments', cluster.get('url')]).findIndex(e => {
      return e.getIn(['metadata', 'name']) === deployment.getIn(['metadata', 'name']);
    });
    this.setState(this.state.removeIn(['deployments', cluster.get('url'), index, 'metadata', 'labels', key]));
  }

  onDeleteDeploymentLabelStart({cluster, deployment, key}) {
    const index = this.state.getIn(['deployments', cluster.get('url')]).findIndex(e => {
      return e.getIn(['metadata', 'name']) === deployment.getIn(['metadata', 'name']);
    });
    this.setState(this.state.removeIn(['deployments', cluster.get('url'), index, 'metadata', 'labels', key]));
  }

  scaleDeploymentStart({cluster, deployment, replicas}) {
    const index = this.state.getIn(['deployments', cluster.get('url')]).findIndex(e => {
      return e.getIn(['metadata', 'name']) === deployment.getIn(['metadata', 'name']);
    });
    this.setState(this.state.setIn(['deployments', cluster.get('url'), index, 'spec', 'replicas'], replicas));
  }

  static getStatus(cluster) {
    return this.state.getIn(['status', cluster.get('url')], 'success');
  }

  static getDeployments(cluster) {
    return this.state.getIn(['deployments', cluster.get('url')], Immutable.List());
  }

  static get({deploymentName, cluster}) {
    return this.state.getIn(['deployments', cluster.get('url')]).find(e => {
      return e.getIn(['metadata', 'name']) === deploymentName;
    });
  }

}

export default alt.createStore(immutableUtil(DeploymentsStore), 'DeploymentsStore');
