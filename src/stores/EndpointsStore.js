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
      if (__DEV__) {
        this.setState(appState.get(this.displayName).set('test.endpoint', Immutable.fromJS({
          url: 'http://localhost:8080', name: 'Test Endpoint', username: 'foo', password: 'bar',
        })));
      } else {
        this.setState(appState.get(this.displayName));
      }
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
