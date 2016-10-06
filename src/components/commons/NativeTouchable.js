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

const {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} = ReactNative;

export default class NativeTouchable extends Component {

  render() {
    if (Platform.OS === 'ios') {
      return <TouchableOpacity {...this.props}>{this.props.children}</TouchableOpacity>;
    }
    let background = TouchableNativeFeedback.Ripple(Colors.BLUE, false);
    const { style, children, ...props } = this.props;

    if (Platform.Version < 21) {
      background = TouchableNativeFeedback.SelectableBackground();
    }
    return (
      <TouchableNativeFeedback delayPressIn={1} background={background} {...props}>
        <View style={style}>
          {children}
        </View>
      </TouchableNativeFeedback>
    );
  }
}
