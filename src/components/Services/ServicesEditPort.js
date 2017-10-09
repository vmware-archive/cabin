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
import Colors, { defaultNavigatorStyle } from 'styles/Colors';
import ListInputItem from 'components/commons/ListInputItem';
import ServicesActions from 'actions/ServicesActions';
import ScrollView from 'components/commons/ScrollView';
import SnackbarUtils from 'utils/SnackbarUtils';

import PropTypes from 'prop-types';

const {
  View,
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  scrollViewContent: {
    marginTop: 20,
  },
});

export default class ServicesEditPort extends Component {

  static propTypes = {
    cluster: PropTypes.instanceOf(Immutable.Map),
    service: PropTypes.instanceOf(Immutable.Map),
    port: PropTypes.instanceOf(Immutable.Map),
  }

  static navigatorStyle = defaultNavigatorStyle;

  static navigatorButtons = {
    rightButtons: [{
      id: 'done',
      title: intl('done'),
    }],
  };

  constructor(props) {
    super(props);
    const { port } = props;
    if (port) {
      this.state = port.toJS();
    } else {
      this.state = {
        name: '',
        port: 8080,
        targetPort: 8080,
        protocol: '',
        nodePort: 33000,
      };
    }
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'done':
        this.onSubmit();
        break;
    }
  }

  render() {
    return (
      <View style={styles.flex}>
        <ScrollView style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps="always">
          <ListInputItem autoCapitalize="none" defaultValue={this.state.name} placeholder="Optional name"
            onChangeText={name => this.setState({name})}/>
          <ListInputItem defaultValue={this.state.protocol} placeholder="Protocol" editable={false}/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} defaultValue={this.state.port && this.state.port.toString()} placeholder="Port"
            onChangeText={port => this.setState({port: parseInt(port, 10) || ''})}/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} defaultValue={this.state.targetPort && this.state.targetPort.toString()} placeholder="Target Port"
            onChangeText={targetPort => this.setState({targetPort: parseInt(targetPort, 10) || ''})}/>
          {this.state.nodePort && <ListInputItem defaultValue={this.state.nodePort.toString()} placeholder="NodePort" editable={false} isLast={true}/>}
        </ScrollView>
      </View>
    );
  }

  onSubmit() {
    const { cluster, service, port: previousPort } = this.props;
    const newPort = Immutable.fromJS(this.state);
    newPort.get('name') && newPort.set('name', newPort.get('name').toLowerCase());
    let ports = Immutable.List();
    if (previousPort.get('port') !== newPort.get('port')) {
      ports = ports.push(Immutable.fromJS({'$patch': 'delete', 'port': previousPort.get('port')}));
    }
    ports = ports.push(newPort);
    ServicesActions.updateServicePorts({cluster, service, ports}).then(() => {
      this.props.navigator.pop();
    }).catch((e) => {
      SnackbarUtils.showError({title: e.message});
    });
  }
}
