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

const { PropTypes } = React;
const {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BLUE,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 5,
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
    prefix: PropTypes.string,
    onChange: PropTypes.func.isRequired,
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

  handlePress() {
    const { choices } = this.props;
    const onPress = (index) => {
      if (index === 0) { return; }
      this.props.onChange(index - 1);
    };
    const options = [
      { title: intl('cancel') },
      ...choices.map(n => { return {title: n, onPress};}),
    ];
    ActionSheetUtils.showActionSheetWithOptions({options});
  }

}
