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
import { ClustersIndexNavBarTitle } from 'components/Clusters/ClustersIndex';
import ClustersNew from 'components/Clusters/ClustersNew';
import { ClustersNewGoogleContainer } from 'components/Clusters/ClustersNewGoogle';
import { ClustersShowContainer } from 'components/Clusters/ClustersShow';
import { ClustersNavbarTitleContainer } from 'components/Clusters/ClustersNavbarTitle';
import Search from 'components/Search';
import SearchBar from 'components/SearchBar';

import { PodsShowContainer } from 'components/Pods/PodsShow';
import { PodsLogsContainer } from 'components/Pods/PodsLogs';
import { PodsExecContainer } from 'components/Pods/PodsExec';
import { NodesShowContainer } from 'components/Nodes/NodesShow';
import { ServicesShowContainer } from 'components/Services/ServicesShow';
import ServicesNew from 'components/Services/ServicesNew';
import ServicesEditPort from 'components/Services/ServicesEditPort';
import { ReplicationsShowContainer } from 'components/Replications/ReplicationsShow';
import { DeploymentsShowContainer } from 'components/Deployments/DeploymentsShow';
import { DeploymentsHistoryContainer } from 'components/Deployments/DeploymentsHistory';
import DeploymentsNew from 'components/Deployments/DeploymentsNew';
import { HorizontalPodAutoscalersShowContainer } from 'components/HorizontalPodAutoscalers/HorizontalPodAutoscalersShow';
import HorizontalPodAutoscalersNew from 'components/HorizontalPodAutoscalers/HorizontalPodAutoscalersNew';
import EntitiesShow from 'components/EntitiesShow';
import YamlView from 'components/YamlView';

import { DeployIndexContainer } from 'components/Deploy/DeployIndex';
import { DeployClustersContainer } from 'components/Deploy/DeployClusters';
import SettingsIndex from 'components/Settings/Settings';
import { SettingsEntitiesContainer } from 'components/Settings/SettingsEntities';
import { SettingsChartsStoresContainer } from 'components/Settings/SettingsChartsStores';

// register all screens of the app (including internal ones)
export function registerScreens() {
  // Clusters
  Navigation.registerComponent('cabin.ClustersIndex', () => ClustersIndex);
  Navigation.registerComponent('cabin.ClustersIndex.Title', () => ClustersIndexNavBarTitle);
  Navigation.registerComponent('cabin.ClustersNew', () => ClustersNew);
  Navigation.registerComponent('cabin.ClustersNewGoogle', () => ClustersNewGoogleContainer);
  Navigation.registerComponent('cabin.ClustersShow', () => ClustersShowContainer);
  Navigation.registerComponent('cabin.ClustersShow.Navbar', () => ClustersNavbarTitleContainer);
  Navigation.registerComponent('cabin.ClustersSearch', () => Search);
  Navigation.registerComponent('cabin.ClustersSearch.SearchBar', () => SearchBar);

  // Entities
  Navigation.registerComponent('cabin.PodsShow', () => PodsShowContainer);
  Navigation.registerComponent('cabin.PodsLogs', () => PodsLogsContainer);
  Navigation.registerComponent('cabin.PodsExec', () => PodsExecContainer);
  Navigation.registerComponent('cabin.NodesShow', () => NodesShowContainer);
  Navigation.registerComponent('cabin.ServicesShow', () => ServicesShowContainer);
  Navigation.registerComponent('cabin.ServicesNew', () => ServicesNew);
  Navigation.registerComponent('cabin.ServicesEditPort', () => ServicesEditPort);
  Navigation.registerComponent('cabin.ReplicationsShow', () => ReplicationsShowContainer);
  Navigation.registerComponent('cabin.DeploymentsShow', () => DeploymentsShowContainer);
  Navigation.registerComponent('cabin.DeploymentsNew', () => DeploymentsNew);
  Navigation.registerComponent('cabin.DeploymentsHistory', () => DeploymentsHistoryContainer);
  Navigation.registerComponent('cabin.HPAsShow', () => HorizontalPodAutoscalersShowContainer);
  Navigation.registerComponent('cabin.HPAsNew', () => HorizontalPodAutoscalersNew);
  Navigation.registerComponent('cabin.EntitiesShow', () => EntitiesShow);
  Navigation.registerComponent('cabin.EntitiesYaml', () => YamlView);

  // Deploy
  Navigation.registerComponent('cabin.DeployIndex', () => DeployIndexContainer);
  Navigation.registerComponent('cabin.DeployClusters', () => DeployClustersContainer);

  // Settings
  Navigation.registerComponent('cabin.SettingsIndex', () => SettingsIndex);
  Navigation.registerComponent('cabin.SettingsEntities', () => SettingsEntitiesContainer);
  Navigation.registerComponent('cabin.SettingsChartsStores', () => SettingsChartsStoresContainer);
}
