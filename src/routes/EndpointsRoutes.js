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
import EndpointsIndex from 'components/Endpoints/EndpointsIndex';
import EndpointsNew from 'components/Endpoints/EndpointsNew';
import EndpointShow from 'components/Endpoints/EndpointShow';
import EndpointsNavbarTitle from 'components/Endpoints/EndpointsNavbarTitle';
import NavbarButton from 'components/commons/NavbarButton';
import Navigator from 'components/commons/Navigator';
import NavigationActions from 'actions/NavigationActions';
import AltContainer from 'alt-container';

const { DeviceEventEmitter } = ReactNative;

const EndpointsRoutes = {
  getEndpointsIndexRoute() {
    return {
      name: 'EndpointsIndex',
      statusBarStyle: 'light-content',
      getTitle: () => 'Clusters',
      renderScene(navigator) {
        return <EndpointsIndex navigator={navigator} />;
      },
      renderRightButton() {
        return (
          <NavbarButton source={require('images/add.png')}
            onPress={() => NavigationActions.pushRoute(EndpointsRoutes.getEndpointsNewRoute())}
          />
        );
      },
    };
  },

  getEndpointShowRoute(endpoint) {
    return {
      name: 'EndpointShow',
      statusBarStyle: 'light-content',
      getTitle: () => endpoint.get('name'),
      getBackButtonTitle: () => '',
      renderTitle: () => {
        return (
          <AltContainer stores={{
            endpoint: () => {
              return {
                store: alt.stores.EndpointsStore,
                value: alt.stores.EndpointsStore.get(endpoint.get('url')),
              };
            }}}>
            <EndpointsNavbarTitle endpoint={endpoint} />
          </AltContainer>
        );
      },
      renderRightButton() {
        return (
          <NavbarButton title={intl('edit')}
            onPress={() => {
              const updatedEndpoint = alt.stores.EndpointsStore.get(endpoint.get('url'));
              NavigationActions.pushRoute(EndpointsRoutes.getEndpointsNewRoute(updatedEndpoint));
            }}
          />
        );
      },
      renderScene(navigator) {
        return (
          <AltContainer stores={{
            endpoint: () => {
              return {
                store: alt.stores.EndpointsStore,
                value: alt.stores.EndpointsStore.get(endpoint.get('url')),
              };
            }}}>
            <EndpointShow
              navigator={navigator}
              endpoint={alt.stores.EndpointsStore.get(endpoint.get('url'))}
            />
          </AltContainer>
        );
      },
    };
  },

  getEndpointsNewRoute(optionalEndpoint) {
    return {
      name: 'EndpointsNew',
      statusBarStyle: 'light-content',
      renderScene() {
        return (
          <Navigator
            initialRoute={{
              getTitle: () => 'New Endpoint',
              renderScene(navigator) {
                return <EndpointsNew endpoint={optionalEndpoint} navigator={navigator} />;
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
                    onPress={() => DeviceEventEmitter.emit('EndpointsNew:submit')}
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

export default EndpointsRoutes;
