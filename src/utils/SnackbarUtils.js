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
import Colors from 'styles/Colors';
import Snackbar from 'react-native-snackbar';

export default class SnackbarUtils {

  static DURATION_SHORT = Snackbar.LENGTH_SHORT;
  static DURATION_LONG = Snackbar.LENGTH_LONG;
  static DURATION_INDEFINITE = Snackbar.LENGTH_INDEFINITE;

  static showWarning(options) {
    SnackbarUtils.showAlert({
      type: 'warning',
      ...options,
    });
  }

  static showInfo(options) {
    SnackbarUtils.showAlert({
      type: 'info',
      ...options,
    });
  }

  static showSuccess(options) {
    SnackbarUtils.showAlert({
      type: 'success',
      ...options,
    });
  }


  static showError(options) {
    if (!options) {
      options = { title: intl('alert_error') };
    }
    SnackbarUtils.showAlert({
      type: 'error',
      ...options,
    });
  }

  static showAlert(options) {
    let backgroundColor;
    switch (options.type) {
      case 'error':
        backgroundColor = Colors.RED; break;
      case 'warning':
        backgroundColor = Colors.ORANGE; break;
      case 'info':
        backgroundColor = Colors.BLUE; break;
      case 'success':
        backgroundColor = Colors.GREEN; break;
    }
    Snackbar.show({
      title: options.title,
      duration: SnackbarUtils.DURATION_LONG,
      backgroundColor,
      ...options,
    });
  }
}
