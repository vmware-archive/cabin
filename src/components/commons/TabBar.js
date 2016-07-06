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
import EndpointsRoutes from 'routes/EndpointsRoutes';
import SettingsRoutes from 'routes/SettingsRoutes';
import Navigator from 'components/commons/Navigator';
import Colors from 'styles/Colors';

const {
  TabBarIOS,
  StyleSheet,
  View, Text,
} = ReactNative;

const styles = StyleSheet.create({
  sceneStyle: {
    paddingBottom: 50,
  },
});

export default class TabBar extends Component {

  constructor() {
    super();
    this.state = {
      activeTab: 0,
    };
  }

  render() {
    return (
      <TabBarIOS
        unselectedTintColor={Colors.GRAY}
        tintColor={Colors.BLUE}>
        <TabBarIOS.Item
          title="Cluster"
          icon={require('images/target.png')}
          selected={this.state.activeTab === 0}
          onPress={() => this.setState({activeTab: 0})}>
            <Navigator
              sceneStyle={styles.sceneStyle}
              navigatorEvent="endpoints:navigation"
              initialRoute={EndpointsRoutes.getEndpointsIndexRoute()}
            />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Deploy"
          icon={require('images/deploy.png')}
          selected={this.state.activeTab === 1}
          onPress={() => this.setState({activeTab: 1})}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.BACKGROUND}}>
              <Text>Coming soon</Text>
            </View>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Settings"
          icon={require('images/settings.png')}
          selected={this.state.activeTab === 2}
          onPress={() => this.setState({activeTab: 2})}>
            <Navigator
              sceneStyle={styles.sceneStyle}
              navigatorEvent="settings:navigation"
              initialRoute={SettingsRoutes.getSettingsIndexRoute()}
            />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}
