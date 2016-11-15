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
import { MessageBarManager } from 'react-native-message-bar';
import Colors from 'styles/Colors';
import { Platform } from 'react-native';

class AlertUtils {

  static showWarning(options) {
    AlertUtils.showAlert({
      alertType: 'warning',
      ...options,
    });
  }

  static showInfo(options) {
    AlertUtils.showAlert({
      alertType: 'info',
      ...options,
    });
  }

  static showSuccess(options) {
    AlertUtils.showAlert({
      alertType: 'success',
      ...options,
    });
  }


  static showError(options) {
    if (!options) {
      options = { message: intl('alert_error') };
    }
    AlertUtils.showAlert({
      alertType: 'error',
      ...options,
    });
  }

  static showAlert(options) {
    MessageBarManager.showAlert({
      duration: 5000,
      viewTopOffset: Platform.OS === 'ios' ? 64 : 56,
      viewBottomOffset: 50,
      messageNumberOfLines: 0,
      stylesheetInfo: {backgroundColor: Colors.BLUE, strokeColor: 'transparent'},
      stylesheetSuccess: {backgroundColor: Colors.GREEN, strokeColor: 'transparent'},
      stylesheetWarning: {backgroundColor: Colors.ORANGE, strokeColor: 'transparent'},
      stylesheetError: {backgroundColor: Colors.RED, strokeColor: 'transparent'},
      stylesheetExtra: {backgroundColor: Colors.BLUE, strokeColor: 'transparent'},
      ...options,
    });
  }
}

export default AlertUtils;
