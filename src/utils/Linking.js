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
import SafariView from 'react-native-safari-view';
const { Linking, Platform } = ReactNative;

export default class LinkingUtils {

  static openURL(url, openApp) {
    if (openApp || !url.match(/^http(s?):\/\//) || Platform.OS === 'android') {
      Linking.openURL(url);
      return;
    }
    SafariView.isAvailable().then((available) => {
      if (available) {
        SafariView.show({url});
      } else {
        Linking.openURL(url);
      }
    });
  }
}
