import alt from 'src/alt';
const { DeviceEventEmitter } = ReactNative;

class NavigationActions {

  pushRoute(route) {
    DeviceEventEmitter.emit('application:navigation', {
      type: 'push', route,
    });
  }

  popRoute(route) {
    DeviceEventEmitter.emit('application:navigation', {
      type: 'pop', route,
    });
  }

}

export default alt.createActions(NavigationActions);
