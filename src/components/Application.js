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
import ActionSheet from '@exponent/react-native-action-sheet';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';

const { View, DeviceEventEmitter, InteractionManager } = ReactNative;

export default class Application extends Component {

  componentDidMount() {
    InitActions.initializeApplication();
    this.actionSheetListener = DeviceEventEmitter.addListener('actionSheet:show', this.onActionSheetShow.bind(this));
    MessageBarManager.registerMessageBar(this.refs.messageBar);
    // Remove blue overlay (Fix: https://github.com/KBLNY/react-native-message-bar/issues/19)
    InteractionManager.runAfterInteractions(() => {
      MessageBarManager.showAlert({ duration: 10 });
    });
  }

  componentWillUnmount() {
    this.actionSheetListener.remove();
    MessageBarManager.unregisterMessageBar();
  }

  render() {
    return (
      <ActionSheet ref="actionSheet">
        <View style={{flex: 1}}>
          <Navigator
            navigatorEvent="application:navigation"
            showNavigationBar={false}
            sceneStyle={{paddingTop: 0}}
            initialRoute={{
              statusBarStyle: 'light-content',
              getSceneClass() {
                return Home;
              },
            }}
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
