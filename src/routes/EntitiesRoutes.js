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
import EntitiesShow from 'components/EntitiesShow';
import PodsShow from 'components/PodsShow';
import AltContainer from 'alt-container';

export default {

  getEntitiesShowRoute(entity) {
    return {
      name: 'EntitiesShow',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => entity.getIn(['metadata', 'name']),
      renderScene(navigator) {
        return <EntitiesShow entity={entity} navigator={navigator} />;
      },
    };
  },

  getPodsShowRoute({pod, cluster}) {
    return {
      name: 'PodsShow',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => pod.getIn(['metadata', 'name']),
      renderScene(navigator) {
        return (
          <AltContainer stores={{
            pod: () => {
              return {
                store: alt.stores.PodsStore,
                value: alt.stores.PodsStore.get({podName: pod.getIn(['metadata', 'name']), cluster}),
              };
            }}}>
            <PodsShow pod={pod} cluster={cluster} navigator={navigator} />
          </AltContainer>
        );
      },
    };
  },

  getNodesShowRoute({node, cluster}) {
    return {
      name: 'NodesShow',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => node.getIn(['metadata', 'name']),
      renderScene(navigator) {
        return (
          <AltContainer stores={{
            entity: () => {
              return {
                store: alt.stores.NodesStore,
                value: alt.stores.NodesStore.get({nodeName: node.getIn(['metadata', 'name']), cluster}),
              };
            }}}>
            <EntitiesShow entity={node} cluster={cluster} navigator={navigator} />
          </AltContainer>
        );
      },
    };
  },

  getServicesShowRoute(service) {
    return {
      name: 'ServicesShow',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => service.getIn(['metadata', 'name']),
      renderScene(navigator) {
        return <EntitiesShow entity={service} navigator={navigator} />;
      },
    };
  },

  getReplicationsShowRoute(replication) {
    return {
      name: 'ReplicationsShow',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => replication.getIn(['metadata', 'name']),
      renderScene(navigator) {
        return <EntitiesShow entity={replication} navigator={navigator} />;
      },
    };
  },
};
