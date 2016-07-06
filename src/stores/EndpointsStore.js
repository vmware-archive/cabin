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
import EndpointsActions from 'actions/EndpointsActions';
import NodesActions from 'actions/NodesActions';
import Immutable from 'immutable';
import immutableUtil from 'alt-utils/lib/ImmutableUtil';
import { AsyncStorage } from 'react-native';

class EndpointsStore {

  constructor() {
    this.bindActions(InitActions);
    this.bindActions(EndpointsActions);
    this.state = Immutable.Map();
  }

  onInitAppSuccess(appState) {
    if (appState.get(this.displayName)) {
      if (__DEV__) {
        this.setState(appState.get(this.displayName).set('test.endpoint', Immutable.fromJS({
          url: 'http://localhost:8080', name: 'Test Endpoint', username: 'foo', password: 'bar',
        })));
      } else {
        this.setState(appState.get(this.displayName));
      }
      setTimeout(() => {
        this.state.map(endpoint => NodesActions.fetchNodes.defer(endpoint));
      }, 1000);
      return true;
    }
    return false;
  }

  onAddEndpoint({url, name, username, password}) {
    const endpoint = Immutable.fromJS({url, username, password, name: name ? name : url});
    this.setState(this.state.set(endpoint.get('url'), endpoint));
    this.saveStore();
  }

  onRemoveEndpoint(endpoint) {
    this.setState(this.state.remove(endpoint.get('url')));
    this.saveStore();
  }

  saveStore() {
    AsyncStorage.setItem(this.displayName, alt.takeSnapshot(this));
  }

  static get(url) {
    return this.state.get(url);
  }

  static getEndpoints() {
    return this.state.toList();
  }
}

export default alt.createStore(immutableUtil(EndpointsStore), 'EndpointsStore');
