import alt from 'src/alt';
import InitActions from 'actions/InitActions';
import NodesActions from 'actions/NodesActions';
import Immutable from 'immutable';
import immutableUtil from 'alt-utils/lib/ImmutableUtil';
import { AsyncStorage } from 'react-native';

class NodesStore {

  constructor() {
    this.bindActions(InitActions);
    this.bindActions(NodesActions);
    this.state = Immutable.fromJS({
      nodes: {},
      status: {},
    });
  }

  onInitAppSuccess() {
    return AsyncStorage.get(this.displayName).then(snapshot => {
      if (snapshot) {
        this.setState(snapshot);
      }
    });
  }

  onFetchNodesStart(endpoint) {
    this.setState(this.state.setIn(['status', endpoint.get('url')], 'loading'));
  }

  onFetchNodesSuccess({endpoint, nodes}) {
    this.setState(
      this.state.setIn(['nodes', endpoint.get('url')], nodes)
      .setIn(['status', endpoint.get('url')], 'success')
    );
  }

  onFetchNodesFailure(endpoint) {
    this.setState(this.state.setIn(['status', endpoint.get('url')], 'failure'));
  }

}

export default alt.createStore(immutableUtil(NodesStore), 'NodesStore');
