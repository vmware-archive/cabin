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
import alt from 'src/alt';
const { DeviceEventEmitter } = ReactNative;

class NavigationActions {

  push(route) {
    DeviceEventEmitter.emit('application:navigation', {
      type: 'push', route,
    });
  }

  pop(route) {
    DeviceEventEmitter.emit('application:navigation', {
      type: 'pop', route,
    });
  }

  selectTab(index) {
    DeviceEventEmitter.emit('tabbar:navigation', index);
  }

  showCluster(cluster) {
    this.selectTab(0);
    DeviceEventEmitter.emit('clusters:navigation', cluster);
  }
}

export default alt.createActions(NavigationActions);
