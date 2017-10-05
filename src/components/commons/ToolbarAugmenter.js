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
import { Children } from 'react';
import PropTypes from 'prop-types';
import Colors from 'styles/Colors';
import Sizes from 'styles/Sizes';
import NavigationActions from 'actions/NavigationActions';

const { Image, Platform, StyleSheet, Text, ToolbarAndroid, View } = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    height: 56,
    backgroundColor: Colors.BLUE,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.BLUE,
  },
  logo: {
    resizeMode: 'contain',
    width: 32,
    height: 32,
    tintColor: Colors.WHITE,
    marginRight: 24,
  },
  titleImage: {
    resizeMode: 'contain',
    width: 60,
    tintColor: Colors.WHITE,
  },
  title: {
    fontSize: 20,
    fontWeight: Sizes.MEDIUM,
    color: Colors.WHITE,
    marginLeft: 16,
  },
});

/* Augments a scene by providing a Toolbar on Android */
export default class ToolbarAugmenter extends Component {
  static propTypes = {
    /* current scene to render */
    scene: PropTypes.object.isRequired,
    /* route associated with the scene */
    route: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.defaultActions = [
      {
        title: 'Deploy',
        icon: require('images/upload.png'),
        show: 'always',
        // onPress: () =>
          // NavigationActions.push(DeployRoutes.getDeployIndexRoute()),
      },
      {
        title: 'Settings',
        icon: require('images/settings.png'),
        show: 'never',
        // onPress: () =>
          // NavigationActions.push(SettingsRoutes.getSettingsIndexRoute()),
      },
    ];
  }

  getAction(component) {
    return {
      title: component.props.title || component.key,
      icon: component.props.androidSource || component.props.source,
      show: 'always',
      onPress: component.props.onPress,
    };
  }

  render() {
    const { navigator, route, scene } = this.props;
    let toolbar;

    if (Platform.OS === 'ios') {
      return scene;
    }
    if (route.name === 'Home') {
      toolbar = (
        <ToolbarAndroid
          style={styles.toolbar}
          actions={this.defaultActions}
          onActionSelected={i => this.defaultActions[i].onPress()}
        >
          <View style={styles.titleContainer}>
            <Image
              style={styles.logo}
              source={require('images/kubernetes.png')}
            />
            <Image
              style={styles.titleImage}
              source={require('images/cabin.png')}
            />
          </View>
        </ToolbarAndroid>
      );
    } else {
      let actions = null;
      if (route.renderRightButton) {
        const rightComponent = route.renderRightButton(navigator);
        if (rightComponent.props.children) {
          actions = Children.map(rightComponent.props.children, this.getAction);
        } else {
          actions = [this.getAction(rightComponent)];
        }
      }
      toolbar = (
        <ToolbarAndroid
          style={styles.toolbar}
          navIcon={require('images/ic-back-white-48.png')}
          onIconClicked={() => {
            NavigationActions.pop();
          }}
          actions={actions}
          onActionSelected={i => actions[i].onPress()}
        >
          <View style={styles.titleContainer}>
            {route.renderTitle
              ? route.renderTitle()
              : <Text style={styles.title}>
                  {route.getTitle && route.getTitle()}
                </Text>}
          </View>
        </ToolbarAndroid>
      );
    }
    return (
      <View style={styles.container}>
        {toolbar}
        {scene}
      </View>
    );
  }
}
