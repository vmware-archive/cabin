import alt from 'src/alt';
import InitActions from 'actions/InitActions';
import NodesActions from 'actions/NodesActions';
import Immutable from 'immutable';
import immutableUtil from 'alt-utils/lib/ImmutableUtil';
// import { AsyncStorage } from 'react-native';

class NodesStore {

  constructor() {
    this.bindActions(InitActions);
    this.bindActions(NodesActions);
    this.state = Immutable.fromJS({
      nodes: {},
      status: {},
    });
  }

  onInitAppSuccess(appState) {
    if (appState.get(this.displayName)) {
      this.setState(appState.get(this.displayName));
      return true;
    }
    return false;
  }

  onFetchNodesStart(endpoint) {
    this.setState(this.state.setIn(['status', endpoint.get('url')], 'loading'));
  }

  onFetchNodesSuccess({endpoint, nodes}) {
    console.log('fetch nodes');
    this.setState(
      this.state.setIn(['nodes', endpoint.get('url')], nodes)
      .setIn(['status', endpoint.get('url')], 'success')
    );
  }

  onFetchNodesFailure(endpoint) {
    this.setState(this.state.setIn(['status', endpoint.get('url')], 'failure'));
  }

  static getStatus(endpoint) {
    return this.state.getIn(['status', endpoint.get('url')], 'success');
  }

  static getNodes(endpoint) {
    return this.state.getIn(['nodes', endpoint.get('url')], Immutable.List());
  }

}

export default alt.createStore(immutableUtil(NodesStore), 'NodesStore');
