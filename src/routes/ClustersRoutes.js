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
import ClustersNewGoogleCreation from 'components/Clusters/ClustersNewGoogleCreation';
import NavbarButton from 'components/commons/NavbarButton';
import ExNavigator from '@expo/react-native-navigator';
import AltContainer from 'alt-container';

const {
  DeviceEventEmitter,
} = ReactNative;

const ClustersRoutes = {

  getClusterGoogleCreationRoute(projectId) {
    return {
      statusBarStyle: 'light-content',
      getTitle: () => 'Create GKE Cluster',
      getBackButtonTitle: () => '',
      renderScene(navigator) {
        return (
          <AltContainer stores={{
            zones: () => {
              return {
                store: alt.stores.GoogleCloudStore,
                value: alt.stores.GoogleCloudStore.getZones(),
              };
            }}}>
            <ClustersNewGoogleCreation navigator={navigator} projectId={projectId} />
          </AltContainer>
        );
      },
      renderLeftButton(navigator) {
        return (
          <NavbarButton title={intl('cancel')}
            onPress={() => navigator.pop()}
          />
        );
      },
      renderRightButton() {
        return (
          <NavbarButton title={intl('done')}
            androidSource={require('images/done.png')}
            onPress={() => DeviceEventEmitter.emit('ClustersNewGoogle:submit')}
          />
        );
      },
      configureScene() {
        return ExNavigator.SceneConfigs.FloatFromBottom;
      },
    };
  },
};

export default ClustersRoutes;
