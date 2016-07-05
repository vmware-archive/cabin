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
    this.fetchNodesStart();
    return NodesApi.fetchNodes(endpoint).then(nodes => {
      this.fetchNodesSuccess({endpoint, nodes});
    }).catch(e => {
      this.fetchNodesFailure(e);
    });
  }
}

export default alt.createActions(NodesActions);
