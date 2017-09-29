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
import { Navigation } from 'react-native-navigation';

import ClustersIndex from 'components/Clusters/ClustersIndex';
import { DeployIndexContainer } from 'components/Deploy/DeployIndex';
import SettingsIndex from 'components/Settings/Settings';
import { SettingsEntitiesContainer } from 'components/Settings/SettingsEntities';
import { SettingsChartsStoresContainer } from 'components/Settings/SettingsChartsStores';

// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent('cabin.ClustersIndex', () => ClustersIndex);
  Navigation.registerComponent('cabin.DeployIndex', () => DeployIndexContainer);
  Navigation.registerComponent('cabin.SettingsIndex', () => SettingsIndex);
  Navigation.registerComponent('cabin.SettingsEntities', () => SettingsEntitiesContainer);
  Navigation.registerComponent('cabin.SettingsChartsStores', () => SettingsChartsStoresContainer);
}
