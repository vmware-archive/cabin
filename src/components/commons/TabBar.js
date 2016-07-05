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
