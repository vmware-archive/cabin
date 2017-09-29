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
import Navigator from 'components/commons/Navigator';
import Home from 'components/commons/Home';
import InitActions from 'actions/InitActions';
import ActionSheet from '@expo/react-native-action-sheet';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import ToolbarAugmenter from 'components/commons/ToolbarAugmenter';

const {
  BackAndroid,
  DeviceEventEmitter,
  InteractionManager,
  Platform,
  View,
} = ReactNative;

export default class Application extends Component {

  static navigatorStyle = {
    navBarHidden: true,
  }

  constructor() {
    super();
    this.handleBackAndroid = this.handleBackAndroid.bind(this);
  }

  componentDidMount() {
    InitActions.initializeApplication();
    this.actionSheetListener = DeviceEventEmitter.addListener('actionSheet:show', this.onActionSheetShow.bind(this));
    MessageBarManager.registerMessageBar(this.refs.messageBar);
    // Remove blue overlay (Fix: https://github.com/KBLNY/react-native-message-bar/issues/19)
    InteractionManager.runAfterInteractions(() => {
      MessageBarManager.showAlert({ duration: 10 });
    });
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.handleBackAndroid);
    }
  }

  componentWillUnmount() {
    this.actionSheetListener.remove();
    MessageBarManager.unregisterMessageBar();
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.handleBackAndroid);
    }
  }

  handleBackAndroid() {
    const { navigator } = this.refs;

    if (navigator.getCurrentRoutes().length > 1) {
      navigator.pop();
      return true;
    }
    return false;
  }

  render() {
    return (
      <ActionSheet ref="actionSheet">
        <View style={{flex: 1}}>
          <Navigator
            ref="navigator"
            navigatorEvent="application:navigation"
            showNavigationBar={false}
            sceneStyle={{paddingTop: 0}}
            initialRoute={{
              name: 'Home',
              statusBarStyle: 'light-content',
              renderScene() {
                return <Home mainNavigator={this.props.navigator} />;
              },
            }}
            augmentScene={(scene, route) => <ToolbarAugmenter scene={scene} route={route} navigator={this.refs.navigator} />}
          />
          <MessageBar ref="messageBar"/>
        </View>
      </ActionSheet>
    );
  }

  onActionSheetShow({options, title}) {
    let cancelButtonIndex = 0;
    let destructiveButtonIndex;
    const titles = options.map((opt, i) => {
      if (opt.cancel === true) {
        cancelButtonIndex = i;
      } else if (opt.destructive === true) {
        destructiveButtonIndex = i;
      }
      return opt.title;
    });
    this.refs.actionSheet.showActionSheetWithOptions({
      title,
      options: titles,
      cancelButtonIndex, destructiveButtonIndex,
    },
    (index) => {
      const onPress = options[index].onPress;
      onPress && onPress(index);
    });
  }
}
