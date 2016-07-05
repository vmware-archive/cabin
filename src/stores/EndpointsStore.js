import alt from 'src/alt';
import InitActions from 'actions/InitActions';
import EndpointsActions from 'actions/EndpointsActions';
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
      console.log('dev ?', __DEV__);
      if (__DEV__) {
        this.setState(appState.get(this.displayName).set('test.endpoint', Immutable.fromJS({
          url: 'test.endpoint', name: 'Test Endpoint', username: 'foo', password: 'bar',
        })));
      } else {
        this.setState(appState.get(this.displayName));
      }
      return true;
    }
    return false;
  }

  onAddEndpoint({url, username, password}) {
    const endpoint = Immutable.fromJS({url, username, password});
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

  static getEndpoints() {
    return this.state.toList();
  }
}

export default alt.createStore(immutableUtil(EndpointsStore), 'EndpointsStore');
