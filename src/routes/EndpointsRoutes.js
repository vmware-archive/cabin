import Endpoints from 'components/Endpoints';
import EndpointsNew from 'components/EndpointsNew';
import NavbarButton from 'components/commons/NavbarButton';
import Navigator from 'components/commons/Navigator';
import NavigationActions from 'actions/NavigationActions';
const { DeviceEventEmitter } = ReactNative;

const EndpointsRoutes = {
  getEndpointsIndexRoute() {
    return {
      name: 'EndpointsIndex',
      statusBarStyle: 'light-content',
      getTitle: () => 'Endpoints',
      renderScene(navigator) {
        return <Endpoints navigator={navigator} />;
      },
      renderRightButton() {
        return (
          <NavbarButton source={require('images/add.png')}
            onPress={() => NavigationActions.pushRoute(EndpointsRoutes.getEndpointsNewRoute())}
          />
        );
      },
    };
  },

  getEndpointsNewRoute() {
    return {
      name: 'EndpointsNew',
      statusBarStyle: 'light-content',
      getTitle: () => 'New Endpoint',
      renderScene() {
        return (
          <Navigator
            initialRoute={{
              renderScene(navigator) {
                return <EndpointsNew navigator={navigator} />;
              },
              renderLeftButton() {
                return (
                  <NavbarButton title={intl('cancel')}
                    onPress={() => NavigationActions.popRoute()}
                  />
                );
              },
              renderRightButton() {
                return (
                  <NavbarButton title={intl('done')}
                    onPress={() => DeviceEventEmitter.emit('EndpointsNew:submit')}
                  />
                );
              },
            }}
          />
        );
      },
      configureScene() {
        return ReactNative.Navigator.SceneConfigs.FloatFromBottom;
      },
    };
  },
};

export default EndpointsRoutes;
