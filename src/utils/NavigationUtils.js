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
const { DeviceEventEmitter } = ReactNative;

class NavigationUtils {

  selectTab(index) {
    // TODO: Change tab to index
    DeviceEventEmitter.emit('tabbar:setTab', index);
  }

  pushOnTab(index, route) {
    // TODO: Push route on navigator at index
    DeviceEventEmitter.emit('tabbar:push', index, route);
  }

}

export default NavigationUtils;
