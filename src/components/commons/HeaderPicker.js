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
import ActionSheetUtils from 'utils/ActionSheetUtils';
import CommonsRoutes from 'routes/CommonsRoutes';

const { PropTypes } = React;
const {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 30 : 45,
    backgroundColor: Colors.BLUE,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingBottom: Platform.OS === 'android' ? 15 : 10,
    paddingTop: Platform.OS === 'android' ? 15 : 0,
  },
  text: {
    color: Colors.WHITE,
  },
  title: {
    fontWeight: '700',
  },
  arrow: {
    tintColor: Colors.WHITE,
    width: 10, height: 10,
    marginLeft: 4,
    resizeMode: 'contain',
  },
});

export default class HeaderPicker extends Component {

  static propTypes = {
    choices: PropTypes.instanceOf(Immutable.List),
    selectedIndex: PropTypes.number.isRequired,
    destructiveIndex: PropTypes.number,
    prefix: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }

  state = {
    open: false,
  }

  render() {
    const currentChoice = this.props.choices.get(this.props.selectedIndex);
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.innerContainer} onPress={this.handlePress.bind(this)}>
          <Text style={styles.text} numberOfLines={1}>
            {this.props.prefix}
            <Text style={styles.title}> {currentChoice}</Text>
          </Text>
          <Image source={require('images/arrow-down.png')} style={styles.arrow}/>
        </TouchableOpacity>
      </View>
    );
  }

  handleSelect(index) {
    this.props.navigator.pop();
    this.props.onChange(index);
  }

  handlePress() {
    const { choices, prefix, selectedIndex } = this.props;
    if (choices.size > 2 && this.props.navigator) {
      this.props.navigator.push(CommonsRoutes.getSelectPickerRoute({
        title: prefix,
        list: choices,
        selectedIndex,
        onSelect: this.handleSelect.bind(this),
      }));
      return;
    }
    const optionAction = (index) => {
      if (index === 0) { return; }
      this.props.onChange(index - 1);
    };
    const options = [
      { title: intl('cancel') },
      ...choices.map((n, index) => {
        return {title: n, onPress: optionAction, destructive: index === this.props.destructiveIndex};
      }),
    ];
    ActionSheetUtils.showActionSheetWithOptions({options});
  }

}
