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
import ReplicationsActions from 'actions/ReplicationsActions';
import Immutable from 'immutable';
import immutableUtil from 'alt-utils/lib/ImmutableUtil';
import FakeData from './FakeData';

class ReplicationsStore {

  constructor() {
    this.bindActions(InitActions);
    this.bindActions(ReplicationsActions);
    if (__DEV__ && FakeData.get(this.displayName)) {
      this.state = FakeData.get(this.displayName);
    } else {
      this.state = Immutable.fromJS({
        replications: {},
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

  onFetchReplicationsStart(cluster) {
    this.setState(this.state.setIn(['status', cluster.get('url')], 'loading'));
  }

  onFetchReplicationsSuccess({cluster, replications}) {
    this.setState(
      this.state.setIn(['replications', cluster.get('url')], replications.map(e => e.set('kind', 'replications')))
      .setIn(['status', cluster.get('url')], 'success')
    );
  }

  onFetchReplicationsFailure(cluster) {
    const replications = alt.stores.ReplicationsStore.getReplications(cluster);
    this.setState(this.state.setIn(['status', cluster.get('url')], replications.size === 0 ? 'failure' : 'success'));
  }

  onDeleteReplicationStart({cluster, replication}) {
    this.setState(this.state.updateIn(['replications', cluster.get('url')], replications => {
      return replications.filter(p => p.getIn(['metadata', 'name']) !== replication.getIn(['metadata', 'name']));
    }));
  }

  static getStatus(cluster) {
    return this.state.getIn(['status', cluster.get('url')], 'success');
  }

  static getReplications(cluster) {
    return this.state.getIn(['replications', cluster.get('url')], Immutable.List());
  }

}

export default alt.createStore(immutableUtil(ReplicationsStore), 'ReplicationsStore');
