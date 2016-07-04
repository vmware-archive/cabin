import Nodes from 'components/Nodes';
import NodesShow from 'components/NodesShow';

export default {
  getNodesIndexRoute(endpoint) {
    return {
      name: 'NodesIndex',
      statusBarStyle: 'light-content',
      getTitle: () => 'Nodes',
      renderScene(navigator) {
        return <Nodes endpoint={endpoint} navigator={navigator} />;
      },
    };
  },

  getNodesShowRoute(node) {
    return {
      name: 'NodesShow',
      statusBarStyle: 'light-content',
      getTitle: () => node.getIn(['metadata', 'name']),
      renderScene(navigator) {
        return <NodesShow node={node} navigator={navigator} />;
      },
    };
  },
};
