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
import ClustersActions from 'actions/ClustersActions';
import Immutable from 'immutable';
import immutableUtil from 'alt-utils/lib/ImmutableUtil';
import { AsyncStorage } from 'react-native';
import FakeData from './FakeData';

class ClustersStore {

  constructor() {
    this.bindActions(InitActions);
    this.bindActions(ClustersActions);
    if (__DEV__ && FakeData.get(this.displayName)) {
      this.state = FakeData.get(this.displayName);
    } else {
      this.state = Immutable.Map();
    }
  }

  onInitAppSuccess(appState) {
    if (appState.get(this.displayName)) {
      this.setState(this.state.merge(appState.get(this.displayName)));
      setTimeout(() => {
        this.state.map(cluster => {
          if (cluster.get('status') === Constants.Status.RUNNING) {
            ClustersActions.fetchClusterEntities(cluster);
          }
        });
      }, 500);
      return true;
    }
    return false;
  }

  onCheckClusterStart(cluster) {
    if (!this.state.getIn([cluster.get('url'), 'status'])) {
      this.setState(this.state.setIn([cluster.get('url'), 'status'], Constants.Status.CHECKING));
    }
  }

  onCheckClusterSuccess({cluster, up}) {
    const previousStatus = this.state.getIn([cluster.get('url'), 'status']);
    if (up && previousStatus !== Constants.Status.RUNNING) {
      ClustersActions.fetchClusterEntities(cluster);
    }
    this.setState(this.state.setIn([cluster.get('url'), 'status'], up ? Constants.Status.RUNNING : Constants.Status.DOWN));
    this.saveStore();
  }

  onAddCluster({url, name, username, password, token}) {
    const cluster = Immutable.fromJS({url, username, password, name: name ? name : url, status: Constants.Status.CHECKING, token});
    this.setState(this.state.set(cluster.get('url'), cluster));
    this.saveStore();
    return Promise.resolve(cluster);
  }

  onEditCluster({cluster, params}) {
    this.setState(this.state.remove(cluster.get('url'))
      .set(params.get('url'), cluster.merge(params)));
    this.saveStore();
  }

  onRemoveCluster(cluster) {
    this.setState(this.state.remove(cluster.get('url')));
    this.saveStore();
  }

  onSetCurrentNamespace({cluster, namespace}) {
    this.setState(this.state.setIn([cluster.get('url'), 'currentNamespace'], namespace));
    this.saveStore();
  }

  onFetchNamespacesSuccess({cluster, namespaces}) {
    this.setState(this.state.setIn([cluster.get('url'), 'namespaces'], namespaces));
    this.saveStore();
  }

  saveStore() {
    AsyncStorage.setItem(this.displayName, alt.takeSnapshot(this));
  }

  static get(url) {
    return this.state.get(url);
  }

  static getClusters() {
    return this.state.toList();
  }
}

export default alt.createStore(immutableUtil(ClustersStore), 'ClustersStore');
