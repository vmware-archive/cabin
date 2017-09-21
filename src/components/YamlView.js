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
import YAML from 'js-yaml';
import ParsedText from 'react-native-parsed-text';

import PropTypes from 'prop-types';
const {
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  DeviceEventEmitter,
} = ReactNative;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  contentContainer: {
    padding: 16,
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: Colors.BLACK,
    lineHeight: 18,
  },
  key: {
    fontWeight: '600',
  },
  textinput: {
    flex: 1,
    padding: 16,
    fontSize: 14,
    color: Colors.BLACK,
    lineHeight: 18,
    backgroundColor: 'transparent',
  },
});

export default class YamlView extends Component {

  static propTypes = {
    cluster: PropTypes.instanceOf(Immutable.Map).isRequired,
    entity: PropTypes.instanceOf(Immutable.Map).isRequired,
  }

  constructor() {
    super();
    this.state = {
      editing: false,
      textHeight: Dimensions.get('window').height - (64 + 50),
    };
  }

  componentDidMount() {
    this.editListener = DeviceEventEmitter.addListener('yaml:toggleEdit', this.toggleEdit.bind(this));
    this.doneListener = DeviceEventEmitter.addListener('yaml:doneEdit', this.doneEdit.bind(this));
  }

  componentWillUnmount() {
    this.editListener.remove();
    this.doneListener.remove();
  }

  render() {
    const yaml = YAML.safeDump(this.props.entity.remove('kind').toJS(), 8).replace(/(-\n[ ]*)/g, '-');
    if (this.state.editing) {
      return (
        <ScrollView style={styles.container}>
          <TextInput style={[styles.textinput, {height: this.state.textHeight}]} multiline={true}
            defaultValue={yaml}
            onChange={(e) => {
              this.editedYaml = e.nativeEvent.text;
              this.setState({textHeight: e.nativeEvent.contentSize.height});
            }}
          />
        </ScrollView>
      );
    }
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <ParsedText style={styles.text}
          parse={[
            {pattern: /[a-zA-Z]+:/, style: styles.key},
          ]}>
          {yaml}
        </ParsedText>
      </ScrollView>
    );
  }

  toggleEdit() {
    this.setState({editing: !this.state.editing});
  }

  doneEdit() {
    console.log('editedYaml', this.editedYaml);
    // EntitiesActions.editYaml({...this.props, yaml});
  }
}
