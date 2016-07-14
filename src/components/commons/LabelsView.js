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
import ListItem from 'components/commons/ListItem';
import ListHeader from 'components/commons/ListHeader';

const {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} = ReactNative;

const { PropTypes } = React;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  close: {
    width: 10, height: 10,
    tintColor: Colors.GRAY,
  },
  closeContainer: {
    marginVertical: -10,
    marginRight: -10,
    padding: 10,
    paddingTop: 15,
  },
});

export default class LabelsView extends Component {

  static propTypes = {
    entity: PropTypes.instanceOf(Immutable.Map),
    onSubmit: PropTypes.func,
  }

  constructor() {
    super();
    this.newLabel = '';
    this.input;
  }

  render() {
    const { entity } = this.props;

    const labels = entity.getIn(['metadata', 'labels'], Immutable.List());
    const labelItems = labels.map((value, key) => {
      return (
        <ListItem key={key} title={`${key}:${value}`}
          renderDetail={() => {
            return (
              <TouchableOpacity style={styles.closeContainer} onPress={() => this.handleDelete(key)}>
                <Image style={styles.close} source={require('images/close.png')}/>
              </TouchableOpacity>
            );
          }}/>
      );
    }).toArray();
    return (
      <View style={styles.container}>
        <ListHeader title="Labels" />
        {labels.size > 0 && labelItems}
        <ListItem isLast={true} renderTitle={() => {
          return (
            <TextInput style={{flex: 1}} ref={(e) => {this.input = e;}}
              autoCapitalize="none" autoCorrect={false}
              placeholder="key:value"
              returnKeyType="done"
              onSubmitEditing={this.handleSubmit.bind(this)}
              onChangeText={text => { this.newLabel = text; }}/>
          );
        }}/>
      </View>
    );
  }

  handleSubmit() {
    const [key, value] = this.newLabel.split(':');
    if (!key || !value) {
      Alert.alert('Invalid key:value pair', 'Separate key and value with ":" \n(ex: foo:bar)');
      return;
    }
    this.props.onSubmit && this.props.onSubmit({key, value}).then(() => {
      this.input && this.input.setNativeProps({text: ''});
    }).catch(() => {
      Alert.alert('Invalid key:value pair', 'Separate key and value with ":" \n(ex: foo:bar)');
    });
  }

  handleDelete(key) {
    this.props.onDelete && this.props.onDelete(key);
  }

}
