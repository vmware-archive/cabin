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
import PodsLogs from 'components/Pods/PodsLogs';
import PodsExec from 'components/Pods/PodsExec';
import ServicesNew from 'components/Services/ServicesNew';
import ServicesEditPort from 'components/Services/ServicesEditPort';
import HorizontalPodAutoscalersNew from 'components/HorizontalPodAutoscalers/HorizontalPodAutoscalersNew';
import DeploymentsNew from 'components/Deployments/DeploymentsNew';
import DeploymentsHistory from 'components/Deployments/DeploymentsHistory';
import Navigator from 'components/commons/Navigator';
import ExNavigator from '@expo/react-native-navigator';
import NavbarButton from 'components/commons/NavbarButton';
import YamlView from 'components/YamlView';
import YamlNavbarButton from 'components/YamlNavbarButton';
import Colors from 'styles/Colors';
import NavigationActions from 'actions/NavigationActions';
import AltContainer from 'alt-container';

const { DeviceEventEmitter, Platform } = ReactNative;

let EntitiesRoutes = {};

// const yamlRightButton = ({ navigator, cluster, entity, store, editable }) => {
//   return (
//     <NavbarButton
//       source={require('images/view.png')}
//       style={{ tintColor: Colors.WHITE }}
//       onPress={() => {
//         if (store) {
//           entity = store.get({ cluster, entity });
//         }
//         navigator.push(
//           EntitiesRoutes.getEntitiesYamlRoute({ cluster, entity, editable })
//         );
//       }}
//     />
//   );
// };

EntitiesRoutes = {
  getEntitiesShowRoute({ entity, entityType, cluster }) {
    const title = entity.getIn(['metadata', 'name']);
    const backButtonTitle = '';
    switch (entityType) {
      case 'pods':
        return {
          screen: 'cabin.PodsShow', title, backButtonTitle,
          passProps: { pod: entity, cluster },
        };
      case 'nodes':
        return {
          screen: 'cabin.NodesShow', title, backButtonTitle,
          passProps: { node: entity, cluster },
        };
      case 'services':
        return {
          screen: 'cabin.ServicesShow', title, backButtonTitle,
          passProps: { service: entity, cluster },
        };
      case 'replicationcontrollers':
        return {
          screen: 'cabin.ReplicationsShow', title, backButtonTitle,
          passProps: { replication: entity, cluster },
        };
      case 'horizontalpodautoscalers':
        return {
          screen: 'cabin.HPAsShow', title, backButtonTitle,
          passProps: { hpa: entity, cluster },
        };
      case 'deployments':
        return {
          screen: 'cabin.DeploymentsShow', title, backButtonTitle,
          passProps: { deployment: entity, cluster },
        };
      default:
        return {
          screen: 'cabin.EntitiesShow', title, backButtonTitle,
          passProps: { entity, cluster },
        };
    }
  },

  getEntitiesYamlRoute({ cluster, entity, editable = false }) {
    return {
      name: 'EntitiesYaml',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => entity.getIn(['metadata', 'name']),
      renderScene(navigator) {
        return (
          <YamlView cluster={cluster} entity={entity} navigator={navigator} />
        );
      },
      renderRightButton: () =>
        <YamlNavbarButton entity={entity} editable={editable} />,
    };
  },

  getPodsLogsRoute({ pod, cluster, container }) {
    return {
      name: 'PodsLogs',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => 'Logs',
      renderRightButton: () => {
        return (
          <NavbarButton
            source={require('images/refresh.png')}
            style={{ tintColor: Colors.WHITE }}
            onPress={() => DeviceEventEmitter.emit('logs:refresh')}
          />
        );
      },
      renderScene(navigator) {
        return (
          <AltContainer
            stores={{
              logs: () => {
                return {
                  store: alt.stores.PodsStore,
                  value: alt.stores.PodsStore.getLogs({ pod, cluster }),
                };
              },
            }}
          >
            <PodsLogs
              logs={alt.stores.PodsStore.getLogs({ pod, cluster })}
              pod={pod}
              container={container}
              cluster={cluster}
              navigator={navigator}
            />
          </AltContainer>
        );
      },
    };
  },

  getPodsExecRoute({ pod, cluster, container }) {
    return {
      name: 'PodsExec',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => 'Exec',
      renderScene(navigator) {
        return (
          <AltContainer
            stores={{
              messages: () => {
                return {
                  store: alt.stores.PodsStore,
                  value: alt.stores.PodsStore.getExecMessages({ pod, cluster }),
                };
              },
            }}
          >
            <PodsExec
              messages={alt.stores.PodsStore.getExecMessages({ pod, cluster })}
              pod={pod}
              container={container}
              cluster={cluster}
              navigator={navigator}
            />
          </AltContainer>
        );
      },
    };
  },

  getServicesNewRoute({ cluster, deployment }) {
    if (!deployment) {
      deployment = alt.stores.DeploymentsStore.getAll(cluster).first();
    }
    const route = {
      name: 'ServicesNew',
      statusBarStyle: 'light-content',
      getTitle: () => intl('service_new'),
      renderScene(navigator) {
        return (
          <ServicesNew
            cluster={cluster}
            defaultDeployment={deployment}
            navigator={navigator}
          />
        );
      },
      renderLeftButton() {
        return (
          <NavbarButton
            title={intl('cancel')}
            onPress={() => NavigationActions.pop()}
          />
        );
      },
      renderRightButton() {
        return (
          <NavbarButton
            title={intl('done')}
            androidSource={require('images/done.png')}
            onPress={() => DeviceEventEmitter.emit('ServicesNew:submit')}
          />
        );
      },
      configureScene() {
        return ExNavigator.SceneConfigs.FloatFromBottom;
      },
    };
    return EntitiesRoutes.getModalRoute(route);
  },

  getModalRoute(route) {
    if (Platform.OS === 'android') {
      return route;
    }
    return {
      name: route.name,
      statusBarStyle: route.statusBarStyle,
      renderScene() {
        return <Navigator initialRoute={route} />;
      },
      configureScene() {
        return ExNavigator.SceneConfigs.FloatFromBottom;
      },
    };
  },

  getServicesEditPortRoute({ cluster, service, port }) {
    const route = {
      name: 'ServicesEditPort',
      statusBarStyle: 'light-content',
      getTitle: () => 'Edit Port',
      renderScene(navigator) {
        return (
          <ServicesEditPort
            cluster={cluster}
            service={service}
            port={port}
            navigator={navigator}
          />
        );
      },
      renderLeftButton() {
        return (
          <NavbarButton
            title={intl('cancel')}
            onPress={() => NavigationActions.pop()}
          />
        );
      },
      renderRightButton() {
        return (
          <NavbarButton
            title={intl('done')}
            androidSource={require('images/done.png')}
            onPress={() => DeviceEventEmitter.emit('ServicesEditPort:submit')}
          />
        );
      },
      configureScene() {
        return ExNavigator.SceneConfigs.FloatFromBottom;
      },
    };
    return EntitiesRoutes.getModalRoute(route);
  },

  getHPANewRoute({ cluster }) {
    const route = {
      name: 'HorizontalPodAutoscalersNew',
      statusBarStyle: 'light-content',
      getTitle: () => intl('hpa_new'),
      renderScene(navigator) {
        return (
          <HorizontalPodAutoscalersNew
            cluster={cluster}
            navigator={navigator}
          />
        );
      },
      renderLeftButton() {
        return (
          <NavbarButton
            title={intl('cancel')}
            onPress={() => NavigationActions.pop()}
          />
        );
      },
      renderRightButton() {
        return (
          <NavbarButton
            title={intl('done')}
            androidSource={require('images/done.png')}
            onPress={() =>
              DeviceEventEmitter.emit('HorizontalPodAutoscalersNew:submit')}
          />
        );
      },
      configureScene() {
        return ExNavigator.SceneConfigs.FloatFromBottom;
      },
    };
    return EntitiesRoutes.getModalRoute(route);
  },

  getDeploymentsNewRoute(cluster) {
    const route = {
      name: 'DeploymentsNew',
      statusBarStyle: 'light-content',
      getTitle: () => intl('deployment_new'),
      renderScene(navigator) {
        return <DeploymentsNew cluster={cluster} navigator={navigator} />;
      },
      renderLeftButton() {
        return (
          <NavbarButton
            title={intl('cancel')}
            onPress={() => NavigationActions.pop()}
          />
        );
      },
      renderRightButton() {
        return (
          <NavbarButton
            title={intl('done')}
            androidSource={require('images/done.png')}
            onPress={() => DeviceEventEmitter.emit('DeploymentsNew:submit')}
          />
        );
      },
      configureScene() {
        return ExNavigator.SceneConfigs.FloatFromBottom;
      },
    };
    return EntitiesRoutes.getModalRoute(route);
  },

  getDeploymentsHistoryRoute({ cluster, deployment }) {
    return {
      name: 'DeploymentsHistory',
      statusBarStyle: 'light-content',
      getTitle: () => intl('history'),
      renderScene(navigator) {
        return (
          <AltContainer
            stores={{
              replicas: () => {
                return {
                  store: alt.stores.DeploymentsStore,
                  value: alt.stores.DeploymentsStore.getDeploymentReplicas({
                    deployment,
                    cluster,
                  }),
                };
              },
            }}
          >
            <DeploymentsHistory
              deployment={deployment}
              cluster={cluster}
              navigator={navigator}
              replicas={alt.stores.DeploymentsStore.getDeploymentReplicas({
                deployment,
                cluster,
              })}
            />
          </AltContainer>
        );
      },
    };
  },
};

export default EntitiesRoutes;
