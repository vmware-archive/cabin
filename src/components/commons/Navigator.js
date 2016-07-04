import { PropTypes } from 'react';
import ExNavigator from '@exponent/react-native-navigator';
import Colors from 'styles/Colors';
import Sizes from 'styles/Sizes';
import TextInputState from 'TextInputState';

const {
  View,
  Animated,
  DeviceEventEmitter,
  StatusBar,
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
  },
  navigationBarStyle: {
    backgroundColor: Colors.BLUE,
    borderBottomWidth: 0,
    position: 'absolute',
    top: 0, left: 0, right: 0,
    overflow: 'hidden',
  },
  titleStyle: {
    color: Colors.WHITE,
    fontWeight: Sizes.REGULAR,
    marginTop: 12,
  },
  barButtonTextStyle: {
    color: Colors.WHITE,
  },
  barButtonIconStyle: {
    tintColor: Colors.WHITE,
  },
  sceneStyle: {
    paddingTop: ReactNative.Platform.OS === 'ios' ? 64 : 0,
    overflow: 'visible',
  },
});

class AzNavigator extends ExNavigator {
  setNavigationBarHidden(hidden) {
    if (this.props.onSetNavigationBarHidden) {
      this.props.onSetNavigationBarHidden(hidden);
    }
  }

  clearToRoute(route) {
    const currentRouteStack = this.getCurrentRoutes();
    const currentRouteName = currentRouteStack[currentRouteStack.length - 1].name;
    if (route && currentRouteName !== route.name) {
      super.resetTo(route);
    }
  }

  push(route) {
    if (!route) {
      return;
    }
    const currentRouteStack = this.getCurrentRoutes();
    const currentRouteName = currentRouteStack[currentRouteStack.length - 1].name;
    if (currentRouteName !== route.name) {
      super.push(route);
    } else {
      super.replace(route);
    }
  }

  pop(route) {
    TextInputState.blurTextInput(TextInputState.currentlyFocusedField());
    const currentRouteStack = this.getCurrentRoutes();
    const currentRouteName = currentRouteStack[currentRouteStack.length - 1].name;

    if (route && currentRouteName === route.name && currentRouteStack.length > 1) {
      super.pop();
    } else if (!route) { // No route provided, still honor the pop with no check
      super.pop();
    }
  }
}

class Navigator extends Component {

  static propTypes = {

    /** The channel on which the navigator will listen events
    * and handle navigation
    **/
    navigatorEvent: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      top: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.navigationEventListener = DeviceEventEmitter.addListener(this.props.navigatorEvent, this.handleNavigationChange.bind(this));
    this.navigationContextListener = this.refs.Navigator.navigationContext.addListener('willfocus', (event) => {
      this.setStatusBarStyle(event.data.route.statusBarStyle);
      event.data.route.onWillFocus && event.data.route.onWillFocus();
    });
    this.navigationContextListener = this.refs.Navigator.navigationContext.addListener('willblur', (event) => {
      event.data.route.onWillBlur && event.data.route.onWillBlur();
    });
    this.navigationContextListener = this.refs.Navigator.navigationContext.addListener('didfocus', (event) => {
      event.data.route.onDidFocus && event.data.route.onDidFocus();
    });
    this.navigationContextListener = this.refs.Navigator.navigationContext.addListener('didblur', (event) => {
      event.data.route.onDidBlur && event.data.route.onDidBlur();
    });
  }

  componentWillUnmount() {
    this.navigationEventListener.remove();
    this.navigationContextListener.remove();
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const navigationBarStyle = this.props.navigationBarStyle || styles.navigationBarStyle;
    return (
      <Animated.View style={[styles.container, {top: this.state.top}]}>
        <AzNavigator
          ref="Navigator"
          barButtonIconStyle={styles.barButtonIconStyle}
          barButtonTextStyle={styles.barButtonTextStyle}
          titleStyle={styles.titleStyle}
          {...this.props}
          sceneStyle={[this.props.sceneStyle, styles.sceneStyle]}
          onSetNavigationBarHidden={this.setNavigationBarHidden.bind(this)}
          navigationBarStyle={navigationBarStyle}
        />
      </Animated.View>
    );
  }

  setNavigationBarHidden(hidden) {
    Animated.parallel([
      Animated.timing(
        this.state.top,
        {toValue: hidden ? -64 : 0, duration: 300}
      ),
    ]).start();
  }

  setStatusBarStyle(statusBarStyle = 'default') {
    if (ReactNative.Platform.OS === 'ios') {
      StatusBar.setBarStyle(statusBarStyle, true);
    }
  }

  handleNavigationChange({type, route}) {
    const navigator = this.refs.Navigator;

    switch (type) {
      case 'push':
        navigator.push(route);
        break;
      default:
      case 'pop':
        navigator.pop(route);
        break;
      case 'popToRoute':
        navigator.popToRoute(route);
        break;
      case 'popToTop':
        navigator.popToTop();
        break;
      case 'clearToRoute':
        navigator.clearToRoute(route);
        break;
      case 'replace':
        navigator.replace(route);
        break;
    }
    this.forceUpdate();
  }

  getCurrentRoutes() {
    return this.refs.Navigator.getCurrentRoutes();
  }

  push(route) {
    return this.refs.Navigator.push(route);
  }

  canPop() {
    return this.refs.Navigator.getCurrentRoutes().length > 1;
  }

  pop() {
    return this.refs.Navigator.pop();
  }

  popToTop() {
    return this.refs.Navigator.popToTop();
  }
}

export default Navigator;
