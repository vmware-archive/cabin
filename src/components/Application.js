import EndpointsRoutes from 'routes/EndpointsRoutes';
import SettingsRoutes from 'routes/SettingsRoutes';
import Navigator from 'components/commons/Navigator';
import Colors from 'styles/Colors';

const {
  TabBarIOS,
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  sceneStyle: {
    paddingBottom: 50,
  },
});

export default class Application extends Component {

  constructor() {
    super();
    this.state = {
      activeTab: 0,
    };
  }

  render() {
    return (
      <TabBarIOS
        unselectedTintColor={Colors.BORDER}
        tintColor={Colors.BLUE}>
        <TabBarIOS.Item
          title="Endpoints"
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
          title="Settings"
          icon={require('images/settings.png')}
          selected={this.state.activeTab === 1}
          onPress={() => this.setState({activeTab: 1})}>
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
