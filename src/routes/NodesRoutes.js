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
