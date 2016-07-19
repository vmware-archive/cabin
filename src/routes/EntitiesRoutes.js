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
import PodsShow from 'components/Pods/PodsShow';
import PodsLogs from 'components/Pods/PodsLogs';
import NodesShow from 'components/Nodes/NodesShow';
import ServicesShow from 'components/Services/ServicesShow';
import ReplicationsShow from 'components/Replications/ReplicationsShow';
import YamlView from 'components/YamlView';
import NavbarButton from 'components/commons/NavbarButton';
import AltContainer from 'alt-container';
import YAML from 'yamljs';
import Colors from 'styles/Colors';
import ActionSheetUtils from 'utils/ActionSheetUtils';

const { View, Clipboard, DeviceEventEmitter } = ReactNative;

let EntitiesRoutes = {};

const yamlRightButton = ({navigator, entity}) => {
  return (
    <NavbarButton source={require('images/view.png')} style={{tintColor: Colors.WHITE}}
      onPress={() => navigator.push(EntitiesRoutes.getEntitiesYamlRoute(entity))}
    />
  );
};

EntitiesRoutes = {

  getEntitiesShowRoute(entity) {
    return {
      name: 'EntitiesShow',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => entity.getIn(['metadata', 'name']),
      renderRightButton(navigator) { return yamlRightButton({navigator, entity}); },
      renderScene(navigator) {
        return <EntitiesShow entity={entity} navigator={navigator} />;
      },
    };
  },

  getEntitiesYamlRoute(entity) {
    return {
      name: 'EntitiesYaml',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => entity.getIn(['metadata', 'name']),
      renderScene(navigator) {
        return <YamlView entity={entity} navigator={navigator} />;
      },
      renderRightButton() {
        const yaml = YAML.stringify(entity.toJS(), 4);
        return (
          <NavbarButton title="Copy"
            onPress={() => Clipboard.setString(yaml)}
          />
        );
      },
    };
  },

  getPodsShowRoute({pod, cluster}) {
    return {
      name: 'PodsShow',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => pod.getIn(['metadata', 'name']),
      renderRightButton(navigator) { return yamlRightButton({navigator, entity: pod}); },
      renderScene(navigator) {
        return (
          <AltContainer stores={{
            pod: () => {
              return {
                store: alt.stores.PodsStore,
                value: alt.stores.PodsStore.get({pod, cluster}),
              };
            }}}>
            <PodsShow pod={pod} cluster={cluster} navigator={navigator} />
          </AltContainer>
        );
      },
    };
  },

  getPodsLogsRoute({pod, cluster}) {
    return {
      name: 'PodsLogs',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => 'Logs',
      renderRightButton: () => {
        return (
          <NavbarButton source={require('images/refresh.png')} style={{tintColor: Colors.WHITE}}
            onPress={() => DeviceEventEmitter.emit('logs:refresh')}
          />
        );
      },
      renderScene(navigator) {
        return (
          <AltContainer stores={{
            logs: () => {
              return {
                store: alt.stores.PodsStore,
                value: alt.stores.PodsStore.getLogs({pod, cluster}),
              };
            }}}>
            <PodsLogs logs={alt.stores.PodsStore.getLogs({pod, cluster})} pod={pod} cluster={cluster} navigator={navigator} />
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
            node: () => {
              return {
                store: alt.stores.NodesStore,
                value: alt.stores.NodesStore.get({nodeName: node.getIn(['metadata', 'name']), cluster}),
              };
            }}}>
            <NodesShow node={node} cluster={cluster} navigator={navigator} />
          </AltContainer>
        );
      },
      renderRightButton(navigator) {
        const options = [
          {title: intl('cancel')},
          {title: 'Put in maintenance', onPress: () => console.log('GO MAINTENANCE')},
        ];
        return (
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingRight: 4}}>
            <NavbarButton source={require('images/view.png')} style={{tintColor: Colors.WHITE}}
              onPress={() => navigator.push(EntitiesRoutes.getEntitiesYamlRoute(node))}
            />
            <NavbarButton source={require('images/more.png')} style={{tintColor: Colors.WHITE}}
              onPress={() => ActionSheetUtils.showActionSheetWithOptions(options)}
            />
          </View>
        );
      },
    };
  },

  getServicesShowRoute({service, cluster}) {
    return {
      name: 'ServicesShow',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => service.getIn(['metadata', 'name']),
      renderRightButton(navigator) { return yamlRightButton({navigator, entity: service}); },
      renderScene(navigator) {
        return (
          <AltContainer stores={{
            service: () => {
              return {
                store: alt.stores.ServicesStore,
                value: alt.stores.ServicesStore.get({serviceName: service.getIn(['metadata', 'name']), cluster}),
              };
            }}}>
            <ServicesShow service={service} cluster={cluster} navigator={navigator} />
          </AltContainer>
        );
      },
    };
  },

  getReplicationsShowRoute({replication, cluster}) {
    return {
      name: 'ReplicationsShow',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => replication.getIn(['metadata', 'name']),
      renderRightButton(navigator) { return yamlRightButton({navigator, entity: replication}); },
      renderScene(navigator) {
        return (
          <AltContainer stores={{
            replication: () => {
              return {
                store: alt.stores.ReplicationsStore,
                value: alt.stores.ReplicationsStore.get({replicationName: replication.getIn(['metadata', 'name']), cluster}),
              };
            }}}>
            <ReplicationsShow replication={replication} cluster={cluster} navigator={navigator} />
          </AltContainer>
        );
      },
    };
  },
};

export default EntitiesRoutes;
