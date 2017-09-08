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
import PodsExec from 'components/Pods/PodsExec';
import NodesShow from 'components/Nodes/NodesShow';
import ServicesShow from 'components/Services/ServicesShow';
import ServicesNew from 'components/Services/ServicesNew';
import ServicesEditPort from 'components/Services/ServicesEditPort';
import ReplicationsShow from 'components/Replications/ReplicationsShow';
import HorizontalPodAutoscalersShow from 'components/HorizontalPodAutoscalers/HorizontalPodAutoscalersShow';
import DeploymentsShow from 'components/Deployments/DeploymentsShow';
import DeploymentsNew from 'components/Deployments/DeploymentsNew';
import DeploymentsHistory from 'components/Deployments/DeploymentsHistory';
import Navigator from 'components/commons/Navigator';
import ExNavigator from '@expo/react-native-navigator';
import NavbarButton from 'components/commons/NavbarButton';
import YamlView from 'components/YamlView';
import YamlNavbarButton from 'components/YamlNavbarButton';
import Colors from 'styles/Colors';
import ActionSheetUtils from 'utils/ActionSheetUtils';
import NavigationActions from 'actions/NavigationActions';
import NodesActions from 'actions/NodesActions';
import DeploymentsActions from 'actions/DeploymentsActions';
import EntitiesUtils from 'utils/EntitiesUtils';
import AltContainer from 'alt-container';
import Alert from 'utils/Alert';

const { View, DeviceEventEmitter, Platform } = ReactNative;

let EntitiesRoutes = {};

const yamlRightButton = ({ navigator, cluster, entity, store, editable }) => {
  return (
    <NavbarButton
      source={require('images/view.png')}
      style={{ tintColor: Colors.WHITE }}
      onPress={() => {
        if (store) {
          entity = store.get({ cluster, entity });
        }
        navigator.push(
          EntitiesRoutes.getEntitiesYamlRoute({ cluster, entity, editable })
        );
      }}
    />
  );
};

EntitiesRoutes = {
  getEntitiesShowRoute({ entity, entityType, cluster }) {
    switch (entityType) {
      case 'pods':
        return EntitiesRoutes.getPodsShowRoute({ pod: entity, cluster });
      case 'nodes':
        return EntitiesRoutes.getNodesShowRoute({ node: entity, cluster });
      case 'services':
        return EntitiesRoutes.getServicesShowRoute({
          service: entity,
          cluster,
        });
      case 'replicationcontrollers':
        return EntitiesRoutes.getReplicationsShowRoute({
          replication: entity,
          cluster,
        });
      case 'horizontalpodautoscalers':
        return EntitiesRoutes.getHorizontalPodAutoscalersShowRoute({
          hpa: entity,
          cluster,
        });
      case 'deployments':
        return EntitiesRoutes.getDeploymentsShowRoute({
          deployment: entity,
          cluster,
        });
      default:
        const store = EntitiesUtils.storeForType(entityType);
        return {
          name: 'EntitiesShow',
          statusBarStyle: 'light-content',
          getBackButtonTitle: () => '',
          getTitle: () => entity.getIn(['metadata', 'name']),
          renderRightButton(navigator) {
            return yamlRightButton({ cluster, navigator, entity, store });
          },
          renderScene(navigator) {
            return (
              <EntitiesShow
                entity={entity}
                cluster={cluster}
                navigator={navigator}
              />
            );
          },
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

  getPodsShowRoute({ pod, cluster }) {
    return {
      name: 'PodsShow',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => pod.getIn(['metadata', 'name']),
      renderRightButton(navigator) {
        return yamlRightButton({
          cluster,
          navigator,
          entity: pod,
          store: alt.stores.PodsStore,
        });
      },
      renderScene(navigator) {
        return (
          <AltContainer
            stores={{
              pod: () => {
                return {
                  store: alt.stores.PodsStore,
                  value: alt.stores.PodsStore.get({ entity: pod, cluster }),
                };
              },
            }}
          >
            <PodsShow pod={pod} cluster={cluster} navigator={navigator} />
          </AltContainer>
        );
      },
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

  getNodesShowRoute({ node, cluster }) {
    return {
      name: 'NodesShow',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => node.getIn(['metadata', 'name']),
      renderScene(navigator) {
        return (
          <AltContainer
            stores={{
              node: () => {
                return {
                  store: alt.stores.NodesStore,
                  value: alt.stores.NodesStore.get({ entity: node, cluster }),
                };
              },
            }}
          >
            <NodesShow node={node} cluster={cluster} navigator={navigator} />
          </AltContainer>
        );
      },
      renderRightButton(navigator) {
        const options = [
          { title: intl('cancel') },
          {
            title: 'Put in maintenance',
            onPress: () => NodesActions.putInMaintenance({ cluster, node }),
          },
        ];
        return (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingRight: 10,
            }}
          >
            <NavbarButton
              source={require('images/view.png')}
              style={{ tintColor: Colors.WHITE }}
              onPress={() =>
                navigator.push(
                  EntitiesRoutes.getEntitiesYamlRoute({ entity: node })
                )}
            />
            <NavbarButton
              source={require('images/more.png')}
              style={{ tintColor: Colors.WHITE, marginLeft: 15 }}
              onPress={() =>
                ActionSheetUtils.showActionSheetWithOptions({ options })}
            />
          </View>
        );
      },
    };
  },

  getServicesShowRoute({ service, cluster }) {
    return {
      name: 'ServicesShow',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => service.getIn(['metadata', 'name']),
      renderRightButton(navigator) {
        return yamlRightButton({
          cluster,
          navigator,
          entity: service,
          store: alt.stores.ServicesStore,
        });
      },
      renderScene(navigator) {
        return (
          <AltContainer
            stores={{
              service: () => {
                return {
                  store: alt.stores.ServicesStore,
                  value: alt.stores.ServicesStore.get({
                    entity: service,
                    cluster,
                  }),
                };
              },
            }}
          >
            <ServicesShow
              service={service}
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

  getReplicationsShowRoute({ replication, cluster }) {
    return {
      name: 'ReplicationsShow',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => replication.getIn(['metadata', 'name']),
      renderRightButton(navigator) {
        return yamlRightButton({
          cluster,
          navigator,
          entity: replication,
          store: alt.stores.ReplicationsStore,
        });
      },
      renderScene(navigator) {
        return (
          <AltContainer
            stores={{
              replication: () => {
                return {
                  store: alt.stores.ReplicationsStore,
                  value: alt.stores.ReplicationsStore.get({
                    entity: replication,
                    cluster,
                  }),
                };
              },
            }}
          >
            <ReplicationsShow
              replication={replication}
              cluster={cluster}
              navigator={navigator}
            />
          </AltContainer>
        );
      },
    };
  },

  getHorizontalPodAutoscalersShowRoute({ hpa, cluster }) {
    return {
      name: 'HorizontalPodAutoscalersShow',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => hpa.getIn(['metadata', 'name']),
      renderRightButton(navigator) {
        return yamlRightButton({
          cluster,
          navigator,
          entity: hpa,
          store: alt.stores.HorizontalPodAutoscalersStore,
        });
      },
      renderScene(navigator) {
        return (
          <AltContainer
            stores={{
              hpa: () => {
                return {
                  store: alt.stores.HorizontalPodAutoscalersStore,
                  value: alt.stores.HorizontalPodAutoscalersStore.get({
                    entity: hpa,
                    cluster,
                  }),
                };
              },
            }}
          >
            <HorizontalPodAutoscalersShow
              hpa={hpa}
              cluster={cluster}
              navigator={navigator}
            />
          </AltContainer>
        );
      },
    };
  },

  getDeploymentsShowRoute({ deployment, cluster }) {
    return {
      name: 'DeploymentsShow',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      getTitle: () => deployment.getIn(['metadata', 'name']),
      renderScene(navigator) {
        return (
          <AltContainer
            stores={{
              deployment: () => {
                return {
                  store: alt.stores.DeploymentsStore,
                  value: alt.stores.DeploymentsStore.get({
                    entity: deployment,
                    cluster,
                  }),
                };
              },
            }}
          >
            <DeploymentsShow
              deployment={deployment}
              cluster={cluster}
              navigator={navigator}
            />
          </AltContainer>
        );
      },
      renderRightButton(navigator) {
        const options = [
          { title: intl('cancel') },
          {
            title: intl('deployment_rolling_update_action'),
            onPress: () => {
              const containers = deployment.getIn(
                ['spec', 'template', 'spec', 'containers'],
                Immutable.List()
              );
              if (containers.size !== 1) {
                Alert.alert(null, intl('rolling_update_multiple_containers'));
                return;
              }
              Alert.prompt(
                intl('rolling_update_alert'),
                `${intl(
                  'rolling_update_alert_subtitle'
                )} ${containers.first().get('image')}`,
                [
                  { text: intl('cancel') },
                  {
                    text: intl('rolling_update_start'),
                    onPress: text => {
                      DeploymentsActions.rollingUpdate({
                        cluster,
                        deployment,
                        image: text,
                      });
                    },
                  },
                ]
              );
            },
          },
        ];
        return (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingRight: 10,
            }}
          >
            {yamlRightButton({
              cluster,
              navigator,
              entity: deployment,
              store: alt.stores.DeploymentsStore,
            })}
            <NavbarButton
              source={require('images/more.png')}
              style={{ tintColor: Colors.WHITE, marginLeft: 15 }}
              onPress={() =>
                ActionSheetUtils.showActionSheetWithOptions({ options })}
            />
          </View>
        );
      },
    };
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
