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
import ServicesActions from 'actions/ServicesActions';
import Immutable from 'immutable';
import immutableUtil from 'alt-utils/lib/ImmutableUtil';
import FakeData from './FakeData';

class ServicesStore {

  constructor() {
    this.bindActions(InitActions);
    this.bindActions(ServicesActions);
    if (__DEV__ && FakeData.get(this.displayName)) {
      this.state = FakeData.get(this.displayName);
    } else {
      this.state = Immutable.fromJS({
        services: {},
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

  onFetchServicesStart(cluster) {
    this.setState(this.state.setIn(['status', cluster.get('url')], 'loading'));
  }

  onFetchServicesSuccess({cluster, services}) {
    this.setState(
      this.state.setIn(['services', cluster.get('url')], services)
      .setIn(['status', cluster.get('url')], 'success')
    );
  }

  onFetchServicesFailure(cluster) {
    const services = alt.stores.ServicesStore.getServices(cluster);
    this.setState(this.state.setIn(['status', cluster.get('url')], services.size === 0 ? 'failure' : 'success'));
  }

  static getStatus(cluster) {
    return this.state.getIn(['status', cluster.get('url')], 'success');
  }

  static getServices(cluster) {
    return this.state.getIn(['services', cluster.get('url')], Immutable.List());
  }

}

export default alt.createStore(immutableUtil(ServicesStore), 'ServicesStore');
