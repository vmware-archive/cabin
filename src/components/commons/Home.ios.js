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
  DeviceEventEmitter,
} = ReactNative;

const styles = {
  sceneStyle: {
    paddingBottom: 50,
  },
};

const tabs = Immutable.fromJS([
  {
    title: intl('tabs_clusters'), icon: require('images/target.png'),
    ref: 'clustersNavigator', event: 'clusters:navigation',
    route: ClustersRoutes.getClustersIndexRoute(),
  },
  {
    title: intl('tabs_deploy'), icon: require('images/upload.png'),
    ref: 'deployNavigator', event: 'deploy:navigation',
    route: DeployRoutes.getDeployIndexRoute(),
  },
  {
    title: intl('tabs_settings'), icon: require('images/settings.png'),
    ref: 'settingsNavigator', event: 'settings:navigation',
    route: SettingsRoutes.getSettingsIndexRoute(),
  },
]);

export default class HomeIOS extends Component {

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
    const items = tabs.map((tab, i) => {
      return (
        <TabBarIOS.Item
          key={i}
          title={tab.get('title')}
          icon={tab.get('icon')}
          selected={this.state.activeTab === i}
          onPress={() => this.handleSelecTab(i)}>
            <Navigator
              ref={tab.get('ref')}
              sceneStyle={styles.sceneStyle}
              navigatorEvent={tab.get('event')}
              initialRoute={tab.get('route').toJS()}
            />
        </TabBarIOS.Item>
      );
    });

    return (
      <TabBarIOS
        unselectedTintColor={Colors.GRAY}
        tintColor={Colors.BLUE}>
        {items}
      </TabBarIOS>
    );
  }

  handleSelecTab(index) {
    if (index === this.state.activeTab) {
      const navigator = this.navigatorForIndex(index);
      navigator.popToTop();
    } else {
      this.setState({activeTab: index});
    }
  }

  navigatorForIndex(index) {
    switch (index) {
      case 0: return this.refs.clustersNavigator;
      case 1: return this.refs.deployNavigator;
      case 2: return this.refs.settingsNavigator;
      default: return this.refs.clustersNavigator;
    }
  }
}
