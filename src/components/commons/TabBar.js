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
import ClustersRoutes from 'routes/ClustersRoutes';
import DeployRoutes from 'routes/DeployRoutes';
import SettingsRoutes from 'routes/SettingsRoutes';
import Navigator from 'components/commons/Navigator';
import Colors from 'styles/Colors';

const {
  TabBarIOS,
  StyleSheet,
  DeviceEventEmitter,
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

  componentDidMount() {
    this.navigationEventListener = DeviceEventEmitter.addListener('tabbar:navigation', this.handleSelecTab.bind(this));
  }

  componentWillUnmount() {
    this.navigationEventListener.remove();
  }

  render() {
    return (
      <TabBarIOS
        unselectedTintColor={Colors.GRAY}
        tintColor={Colors.BLUE}>
        <TabBarIOS.Item
          title="Clusters"
          icon={require('images/target.png')}
          selected={this.state.activeTab === 0}
          onPress={() => this.setState({activeTab: 0})}>
            <Navigator
              sceneStyle={styles.sceneStyle}
              navigatorEvent="clusters:navigation"
              initialRoute={ClustersRoutes.getClustersIndexRoute()}
            />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Deploy"
          icon={require('images/upload.png')}
          selected={this.state.activeTab === 1}
          onPress={() => this.setState({activeTab: 1})}>
            <Navigator
              sceneStyle={styles.sceneStyle}
              navigatorEvent="deploy:navigation"
              initialRoute={DeployRoutes.getDeployIndexRoute()}
            />
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

  handleSelecTab(index) {
    this.setState({activeTab: index});
  }
}
