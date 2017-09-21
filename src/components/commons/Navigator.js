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
import PropTypes from 'prop-types';
import ExNavigator from '@expo/react-native-navigator';
import Colors from 'styles/Colors';
import Sizes from 'styles/Sizes';
import TextInputState from 'TextInputState';
import Orientation from 'react-native-orientation';

const {
  View,
  DeviceEventEmitter,
  StatusBar,
  StyleSheet,
  Dimensions,
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
});
const sceneStyle = {
  paddingTop: ReactNative.Platform.OS === 'ios' ? 64 : 0,
  overflow: 'visible',
};

class Navigator extends Component {

  static propTypes = {

    /** The channel on which the navigator will listen events
    * and handle navigation
    **/
    navigatorEvent: PropTypes.string,
  };

  constructor() {
    super();
    this.state = {
      orientation: Orientation.getInitialOrientation(),
    };
    this.onOrientationDidChange = this.onOrientationDidChange.bind(this);
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
    Orientation.addOrientationListener(this.onOrientationDidChange);
    this.windowHeight = Dimensions.get('window').height;
  }

  componentWillUnmount() {
    this.navigationEventListener.remove();
    this.navigationContextListener.remove();
    Orientation.removeOrientationListener(this.onOrientationDidChange);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.orientation !== this.state.orientation;
  }

  render() {
    const navigationBarStyle = this.props.navigationBarStyle || styles.navigationBarStyle;
    const iPhoneLandscape = this.state.orientation === 'LANDSCAPE' && Dimensions.get('window').height < 480;
    return (
      <View style={[styles.container, iPhoneLandscape && {marginTop: -10}]}>
        <ExNavigator
          ref="Navigator"
          barButtonIconStyle={styles.barButtonIconStyle}
          barButtonTextStyle={styles.barButtonTextStyle}
          titleStyle={styles.titleStyle}
          {...this.props}
          sceneStyle={[sceneStyle, this.props.sceneStyle]}
          navigationBarStyle={navigationBarStyle}
        />
      </View>
    );
  }

  setStatusBarStyle(statusBarStyle = 'default') {
    if (ReactNative.Platform.OS === 'ios') {
      StatusBar.setBarStyle(statusBarStyle, true);
    }
  }

  onOrientationDidChange(orientation) {
    this.setState({orientation});
  }

  handleNavigationChange({type, route}) {
    switch (type) {
      case 'push':
        this.push(route);
        break;
      default:
      case 'pop':
        this.pop(route);
        break;
      case 'popToRoute':
        this.popToRoute(route);
        break;
      case 'popToTop':
        this.popToTop();
        break;
      case 'clearToRoute':
        this.clearToRoute(route);
        break;
      case 'replace':
        this.replace(route);
        break;
    }
    this.forceUpdate();
  }

  getCurrentRoutes() {
    return this.refs.Navigator.getCurrentRoutes();
  }

  clearToRoute(route) {
    const currentRouteStack = this.getCurrentRoutes();
    const currentRouteName = currentRouteStack[currentRouteStack.length - 1].name;
    if (route && currentRouteName !== route.name) {
      this.refs.Navigator.resetTo(route);
    }
  }

  push(route) {
    if (!route) {
      return;
    }
    const currentRouteStack = this.getCurrentRoutes();
    const currentRouteName = currentRouteStack[currentRouteStack.length - 1].name;
    if (currentRouteName !== route.name) {
      this.refs.Navigator.push(route);
    } else {
      this.replace(route);
    }
  }

  canPop() {
    return this.refs.Navigator.getCurrentRoutes().length > 1;
  }

  pop(route) {
    TextInputState.blurTextInput(TextInputState.currentlyFocusedField());
    const currentRouteStack = this.getCurrentRoutes();
    const currentRouteName = currentRouteStack[currentRouteStack.length - 1].name;

    if (route && currentRouteName === route.name && currentRouteStack.length > 1) {
      this.refs.Navigator.pop();
    } else if (!route) { // No route provided, still honor the pop with no check
      this.refs.Navigator.pop();
    }
  }

  popToTop() {
    return this.refs.Navigator.popToTop();
  }

  popToRoute(route) {
    return this.refs.Navigator.popToRoute(route);
  }

  replace(route) {
    return this.refs.Navigator.replace(route);
  }
}

export default Navigator;
