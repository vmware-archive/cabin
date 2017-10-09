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
import SnackbarUtils from 'utils/SnackbarUtils';
import NavbarButton from 'components/commons/NavbarButton';
import YAML from 'js-yaml';

import PropTypes from 'prop-types';
const {
  View,
  StyleSheet,
  DeviceEventEmitter,
  Clipboard,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
});

export default class YamlNavbarButton extends Component {

  static propTypes = {
    entity: PropTypes.instanceOf(Immutable.Map).isRequired,
    editable: PropTypes.bool,
  }

  constructor() {
    super();
    this.state = {
      editing: false,
    };
  }

  render() {
    const { entity, editable } = this.props;
    const { editing } = this.state;
    const yaml = YAML.safeDump(entity.toJS(), 0);
    const copy = (
      <NavbarButton source={require('images/copy.png')} style={{tintColor: Colors.WHITE}}
        onPress={() => {
          Clipboard.setString(yaml);
          SnackbarUtils.showInfo({title: 'Yaml has been copied to your clipboard'});
        }}
      />
    );
    if (!editable) {
      return copy;
    }
    if (editing) {
      return this.renderEditing();
    }
    return (
      <View style={styles.container}>
        <NavbarButton source={require('images/edit.png')} style={{tintColor: Colors.WHITE, marginRight: 14}}
          onPress={this.toggleEdit.bind(this)}
        />
        {copy}
      </View>
    );
  }

  renderEditing() {
    return (
      <View style={styles.container}>
        <NavbarButton source={require('images/close.png')} style={{tintColor: Colors.WHITE, marginRight: 14}}
          onPress={this.toggleEdit.bind(this)}
        />
        <NavbarButton source={require('images/done.png')} style={{tintColor: Colors.WHITE}}
          onPress={this.handleSubmit.bind(this)}
        />
      </View>
    );
  }

  toggleEdit() {
    DeviceEventEmitter.emit('yaml:toggleEdit');
    this.setState({editing: !this.state.editing});
  }

  handleSubmit() {
    DeviceEventEmitter.emit('yaml:doneEdit');
    this.toggleEdit();
  }
}
