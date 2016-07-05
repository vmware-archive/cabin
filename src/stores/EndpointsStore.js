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

  onInitAppSuccess() {
    return AsyncStorage.get(this.displayName).then(snapshot => {
      if (snapshot) {
        this.setState(snapshot);
      }
    });
  }

  onAddEndpoint({url, username, password}) {
    const endpoint = Immutable.fromJS({url, username, password});
    this.setState(this.state.set(endpoint.get('url'), endpoint));
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
