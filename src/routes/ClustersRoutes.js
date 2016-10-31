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
import ClustersNewGoogle from 'components/Clusters/ClustersNewGoogle';
import ClusterShow from 'components/Clusters/ClustersShow';
import ClustersNavbarTitle from 'components/Clusters/ClustersNavbarTitle';
import Search from 'components/Search';
import SearchBar from 'components/SearchBar';
import NavbarButton from 'components/commons/NavbarButton';
import Navigator from 'components/commons/Navigator';
import NavigationActions from 'actions/NavigationActions';
import AltContainer from 'alt-container';
import Colors from 'styles/Colors';
// import BaseApi from 'api/BaseApi';

const {
  DeviceEventEmitter,
  Platform,
  View,
  Image,
} = ReactNative;

const ClustersRoutes = {
  getClustersIndexRoute() {
    return {
      name: 'ClustersIndex',
      statusBarStyle: 'light-content',
      renderScene(navigator) {
        return <ClustersIndex navigator={navigator} />;
      },
      renderTitle: () => {
        return (
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Image style={{resizeMode: 'contain', width: 32, height: 32, tintColor: Colors.WHITE, marginRight: 6}} source={require('images/kubernetes.png')} />
            <Image style={{resizeMode: 'contain', width: 60, tintColor: Colors.WHITE}} source={require('images/cabin.png')}/>
          </View>
        );
      },
      renderRightButton() {
        return (
          <NavbarButton source={require('images/add.png')}
            // onPress={() => BaseApi.callGRPC('test')}
            onPress={() => NavigationActions.push(ClustersRoutes.getClusterNewRoute())}
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
            <ClustersNavbarTitle cluster={cluster}/>
          </AltContainer>
        );
      },
      renderRightButton(navigator) {
        return (
          <NavbarButton key="Search" source={require('images/search.png')}
            onPress={() => {
              navigator.push(ClustersRoutes.getClustersSearchRoute(cluster));
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
            },
            entitiesToDisplay: () => {
              return {
                store: alt.stores.SettingsStore,
                value: alt.stores.SettingsStore.getEntitiesToDisplay(),
              };
            }}}>
            <ClusterShow
              navigator={navigator}
              entitiesToDisplay={alt.stores.SettingsStore.getEntitiesToDisplay()}
              cluster={alt.stores.ClustersStore.get(cluster.get('url'))}
            />
          </AltContainer>
        );
      },
    };
  },

  getClusterNewRoute(optionalCluster) {
    const route = ClustersRoutes.getClusterCreationRoute(optionalCluster);
    if (Platform.OS === 'android') {
      return route;
    }
    return {
      name: 'ClustersNew',
      statusBarStyle: 'light-content',
      renderScene() {
        return <Navigator initialRoute={route} />;
      },
      configureScene() {
        return ReactNative.Navigator.SceneConfigs.FloatFromBottom;
      },
    };
  },

  getClusterCreationRoute(optionalCluster) {
    return {
      getTitle: () => 'New Cluster',
      renderScene(navigator) {
        return <ClustersNew cluster={optionalCluster} navigator={navigator} />;
      },
      renderLeftButton() {
        return (
          <NavbarButton title={intl('cancel')}
            onPress={() => NavigationActions.pop()}
          />
        );
      },
      renderRightButton() {
        return (
          <NavbarButton title={intl('done')}
            androidSource={require('images/done.png')}
            onPress={() => DeviceEventEmitter.emit('ClustersNew:submit')}
          />
        );
      },
      configureScene() {
        return ReactNative.Navigator.SceneConfigs.FloatFromBottom;
      },
    };
  },

  getClustersGoogleRoute() {
    return {
      statusBarStyle: 'light-content',
      getTitle: () => 'Google Clusters',
      getBackButtonTitle: () => '',
      renderScene(navigator) {
        return (
          <AltContainer stores={{
            projects: () => {
              return {
                store: alt.stores.GoogleCloudStore,
                value: alt.stores.GoogleCloudStore.getProjects(),
              };
            },
            clusters: () => {
              return {
                store: alt.stores.GoogleCloudStore,
                value: alt.stores.GoogleCloudStore.getClusters(),
              };
            }}}>
            <ClustersNewGoogle navigator={navigator}
              clusters={alt.stores.GoogleCloudStore.getClusters()}
              projects={alt.stores.GoogleCloudStore.getProjects()} />
          </AltContainer>
        );
      },
    };
  },

  getClustersSearchRoute(cluster) {
    return {
      name: 'ClustersSearch',
      statusBarStyle: 'light-content',
      getBackButtonTitle: () => '',
      renderTitle() {
        return <SearchBar/>;
      },
      renderScene(navigator) {
        return (
          <Search cluster={cluster} navigator={navigator} />
        );
      },
      configureScene() {
        return ReactNative.Navigator.SceneConfigs.FadeAndroid;
      },
    };
  },
};

export default ClustersRoutes;
