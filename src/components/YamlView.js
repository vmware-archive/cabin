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
import YAML from 'yamljs';
import ParsedText from 'react-native-parsed-text';

const { PropTypes } = React;
const {
  ScrollView,
  StyleSheet,
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
    fontSize: 14,
    color: Colors.BLACK,
    lineHeight: 18,
  },
  key: {
    fontWeight: '600',
  },
});

export default class YamlView extends Component {

  static propTypes = {
    entity: PropTypes.instanceOf(Immutable.Map).isRequired,
  }

  constructor() {
    super();
  }

  render() {
    const yaml = YAML.stringify(this.props.entity.toJS(), 8).replace(/(-\n[ ]*)/g, '-');
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
}
