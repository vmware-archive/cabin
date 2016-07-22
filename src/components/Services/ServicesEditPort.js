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
import ListInputItem from 'components/commons/ListInputItem';
import ServicesActions from 'actions/ServicesActions';
import NavigationActions from 'actions/NavigationActions';
import ScrollView from 'components/commons/ScrollView';

const { PropTypes } = React;

const {
  View,
  StyleSheet,
  DeviceEventEmitter,
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
  }

  componentDidMount() {
    this.submitListener = DeviceEventEmitter.addListener('ServicesEditPort:submit', this.onSubmit.bind(this));
  }

  componentWillUnmount() {
    this.submitListener.remove();
  }

  render() {
    return (
      <View style={styles.flex}>
        <ScrollView style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps={true}>
          <ListInputItem defaultValue={this.state.name} placeholder="Optional name"
            onChangeText={name => this.setState({name})}/>
          <ListInputItem defaultValue={this.state.protocol} placeholder="Protocol" editable={false}/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} defaultValue={this.state.port.toString()} placeholder="Port"
            onChangeText={port => this.setState({port: parseInt(port, 10)})}/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} defaultValue={this.state.targetPort.toString()} placeholder="Target Port"
            onChangeText={targetPort => this.setState({targetPort: parseInt(targetPort, 10)})} isLast={true}/>
          {this.state.nodePort && <ListInputItem defaultValue={this.state.nodePort.toString()} placeholder="NodePort" editable={false}/>}

        </ScrollView>
      </View>
    );
  }

  onSubmit() {
    const { cluster, service, port: previousPort } = this.props;
    const newPort = Immutable.fromJS(this.state);
    const ports = service.getIn(['spec', 'ports']).map(port => {
      if (Immutable.is(port, previousPort)) {
        return newPort;
      }
      return port;
    });
    ServicesActions.updateServicePorts({cluster, service, ports});
    NavigationActions.pop();
  }

}
