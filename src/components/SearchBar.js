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
import PStyleSheet from 'styles/PStyleSheet';

import PropTypes from 'prop-types';
const {
  View,
  Image,
  TextInput,
  Dimensions,
  InteractionManager,
  Platform,
  DeviceEventEmitter,
} = ReactNative;


const styles = PStyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    ios: {
      width: Dimensions.get('window').width - 50,
      height: 32,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      marginLeft: 6,
      marginTop: 6,
      paddingHorizontal: 10,
      borderRadius: 6,
    },
    android: {
      width: Dimensions.get('window').width - 70,
      height: 45,
      marginLeft: 0,
    },
  },
  icon: {
    width: 15, height: 15,
    tintColor: Colors.WHITE,
    opacity: 0.4,
    marginRight: 5,
  },
  input: {
    flex: 1,
    marginTop: 2,
    color: Colors.WHITE,
    android: {
      fontSize: 20,
      height: 45,
    },
  },
});

export default class SearchBar extends Component {

  static propTypes = {
    autoFocus: PropTypes.boolean,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onChangEventName: PropTypes.string,
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.autoFocus && this.refs.input.focus();
    });
  }

  onChange(text) {
    if (this.props.onChange) {
      this.props.onChange(text);
    } else if (this.props.onChangeEventName) {
      DeviceEventEmitter.emit(this.props.onChangeEventName, {text});
    }
  }
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {Platform.OS === 'ios' && <Image source={require('images/search.png')} style={styles.icon} />}
        <TextInput
          ref="input"
          style={styles.input}
          placeholder={this.props.placeholder}
          numberOfLines={1}
          placeholderTextColor={'rgba(255, 255, 255, 0.4)'}
          returnKeyType="search"
          autoCapitalize="none"
          clearButtonMode="while-editing"
          onChangeText={this.onChange.bind(this)}
        />
      </View>
    );
  }

}
