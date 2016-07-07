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
import ClustersIndex from 'components/Clusters/ClustersIndex';
import ClustersNew from 'components/Clusters/ClustersNew';
import ClusterShow from 'components/Clusters/ClustersShow';
import ClustersNavbarTitle from 'components/Clusters/ClustersNavbarTitle';
import NavbarButton from 'components/commons/NavbarButton';
import Navigator from 'components/commons/Navigator';
import NavigationActions from 'actions/NavigationActions';
import AltContainer from 'alt-container';

const { DeviceEventEmitter } = ReactNative;

const ClustersRoutes = {
  getClustersIndexRoute() {
    return {
      name: 'ClustersIndex',
      statusBarStyle: 'light-content',
      getTitle: () => 'Clusters',
      renderScene(navigator) {
        return <ClustersIndex navigator={navigator} />;
      },
      renderRightButton() {
        return (
          <NavbarButton source={require('images/add.png')}
            onPress={() => NavigationActions.pushRoute(ClustersRoutes.getClustersNewRoute())}
          />
        );
      },
    };
  },

  getClusterShowRoute(cluster) {
    return {
      name: 'ClusterShow',
      statusBarStyle: 'light-content',
      getTitle: () => cluster.get('name'),
      getBackButtonTitle: () => '',
      renderTitle: () => {
        return (
          <AltContainer stores={{
            cluster: () => {
              return {
                store: alt.stores.ClustersStore,
                value: alt.stores.ClustersStore.get(cluster.get('url')),
              };
            }}}>
            <ClustersNavbarTitle cluster={cluster} />
          </AltContainer>
        );
      },
      renderRightButton() {
        return (
          <NavbarButton key="search" source={require('images/search.png')}
            onPress={() => {
              // NavigationActions.pushRoute(ClustersRoutes.getClustersSearchRoute(cluster));
            }}
          />
        );
      },
      renderScene(navigator) {
        return (
          <AltContainer stores={{
            cluster: () => {
              return {
                store: alt.stores.ClustersStore,
                value: alt.stores.ClustersStore.get(cluster.get('url')),
              };
            }}}>
            <ClusterShow
              navigator={navigator}
              cluster={alt.stores.ClustersStore.get(cluster.get('url'))}
            />
          </AltContainer>
        );
      },
    };
  },

  getClustersNewRoute(optionalCluster) {
    return {
      name: 'ClustersNew',
      statusBarStyle: 'light-content',
      renderScene() {
        return (
          <Navigator
            initialRoute={{
              getTitle: () => 'New Cluster',
              renderScene(navigator) {
                return <ClustersNew cluster={optionalCluster} navigator={navigator} />;
              },
              renderLeftButton() {
                return (
                  <NavbarButton title={intl('cancel')}
                    onPress={() => NavigationActions.popRoute()}
                  />
                );
              },
              renderRightButton() {
                return (
                  <NavbarButton title={intl('done')}
                    onPress={() => DeviceEventEmitter.emit('ClustersNew:submit')}
                  />
                );
              },
            }}
          />
        );
      },
      configureScene() {
        return ReactNative.Navigator.SceneConfigs.FloatFromBottom;
      },
    };
  },
};

export default ClustersRoutes;
