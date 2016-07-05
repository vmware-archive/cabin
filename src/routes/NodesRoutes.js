import Nodes from 'components/Nodes';
import NodesShow from 'components/NodesShow';
import AltContainer from 'alt-container';

export default {
  getNodesIndexRoute(endpoint) {
    return {
      name: 'NodesIndex',
      statusBarStyle: 'light-content',
      getTitle: () => 'Nodes',
      renderScene(navigator) {
        return (
          <AltContainer stores={{
            nodes: () => {
              return {
                store: alt.stores.NodesStore,
                value: alt.stores.NodesStore.getNodes(endpoint),
              };
            }}}>
            <Nodes
              navigator={navigator}
              status={alt.stores.NodesStore.getStatus(endpoint)}
              nodes={alt.stores.NodesStore.getNodes(endpoint)}
              endpoint={endpoint}
            />
          </AltContainer>
        );
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
