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
import Colors, { defaultNavigatorStyle } from 'styles/Colors';
import { registerScreens } from './src/screens';
import { Navigation } from 'react-native-navigation';

registerScreens();
class AndroidHome extends Component {
  static navigatorStyle = {
    ...defaultNavigatorStyle,
    topTabIconColor: Colors.WHITE,
    selectedTopTabIconColor: Colors.WHITE,
    selectedTopTabIndicatorHeight: 4,
    selectedTopTabIndicatorColor: Colors.WHITE,
  }

  static navigatorButtons = {
    leftButtons: [{
      id: 'icon',
      icon: require('images/cabin-title-android.png'),
    }],
  };

}
Navigation.registerComponent('cabin.AndroidHome', () => AndroidHome);

Navigation.startSingleScreenApp({
  screen: {
    screen: 'cabin.AndroidHome',
    navigatorStyle: defaultNavigatorStyle,
    topTabs: [{
      screenId: 'cabin.ClustersIndex',
      icon: require('images/target.png'),
    }, {
      screenId: 'cabin.DeployIndex',
      icon: require('images/upload.png'),
    }, {
      screenId: 'cabin.SettingsIndex',
      icon: require('images/settings.png'),
    }],
  },
  appStyle: {
  },
});
