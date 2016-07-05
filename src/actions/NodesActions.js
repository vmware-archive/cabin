import alt from 'src/alt';
import NodesApi from 'api/NodesApi';

class NodesActions {

  constructor() {
    this.generateActions(
      'fetchNodesStart',
      'fetchNodesSuccess',
      'fetchNodesFailure',
    );
  }

  fetchNodes(endpoint) {
    this.fetchNodesStart(endpoint);
    return NodesApi.fetchNodes(endpoint).then(nodes => {
      this.fetchNodesSuccess({endpoint, nodes});
    }).catch(() => {
      this.fetchNodesFailure(endpoint);
    });
  }
}

export default alt.createActions(NodesActions);
