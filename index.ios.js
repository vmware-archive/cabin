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
import './src/config';
import Colors from 'styles/Colors';
import { registerScreens } from './src/screens';
import { Navigation } from 'react-native-navigation';

registerScreens();

Navigation.startTabBasedApp({
  tabs: [
    {
      label: intl('tabs_clusters'),
      screen: 'cabin.ClustersIndex',
      icon: require('images/target.png'),
      title: intl('tabs_clusters'),
    },
    {
      label: intl('tabs_deploy'),
      screen: 'cabin.DeployIndex',
      icon: require('images/upload.png'),
      title: intl('tabs_deploy'),
    },
    {
      label: intl('tabs_settings'),
      screen: 'cabin.SettingsIndex',
      icon: require('images/settings.png'),
      title: intl('tabs_settings'),
    },
  ],
  tabsStyle: {
    tabBarSelectedButtonColor: Colors.BLUE,
  },
});
