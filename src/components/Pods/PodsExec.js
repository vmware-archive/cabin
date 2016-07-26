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
import ScrollView from 'components/commons/ScrollView';
import PodsContainerPicker from 'components/Pods/PodsContainerPicker';
import PodsActions from 'actions/PodsActions';
import ParsedText from 'react-native-parsed-text';

const {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
} = ReactNative;

const { PropTypes } = React;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLACK,
  },
  logs: {
    flex: 1,
    padding: 10,
    color: Colors.WHITE,
  },
  bold: {
    fontWeight: '600',
  },
  inputContainer: {
    height: 50,
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.BORDER,
    marginVertical: 8,
    marginLeft: 10,
    paddingLeft: 6,
  },
  inputText: {
    color: Colors.BLUE,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

export default class PodsExec extends Component {

  static propTypes = {
    logs: PropTypes.string,
    container: PropTypes.string,
    pod: PropTypes.instanceOf(Immutable.Map),
    cluster: PropTypes.instanceOf(Immutable.Map),
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      statusBarLoading: false,
      container: props.container || props.pod.getIn(['spec', 'containers', 0, 'name']),
    };
    this.scrollViewHeight = Dimensions.get('window').height - 114;
  }

  render() {
    const { logs, pod, cluster } = this.props;
    const { container } = this.state;
    return (
      <View style={styles.container}>
        <PodsContainerPicker pod={pod} cluster={cluster} selectedContainer={container} onChangeContainer={this.handleContainerChange.bind(this)}/>
        <ScrollView ref="scrollView" style={styles.list}
          onLayout={(e) => { this.scrollViewHeight = e.nativeEvent.layout.height; }}
          onContentSizeChange={(width, height) => {
            if (height > this.scrollViewHeight) {
              this.refs.scrollView.scrollTo({y: height - this.scrollViewHeight});
            } else {
              this.refs.scrollView.scrollTo({y: 0});
            }
          }}>
          <ParsedText style={styles.logs}
            parse={[
              {pattern: /[0-9A-Za-z\/]{5} [0-9.:]{15}    /, style: styles.bold},
              {pattern: /[0-9\/]{10} [0-9:]{8} [a-zA-Z0-9]+:/, style: styles.bold},
              {pattern: /[0-9\/\-]{10} [0-9:]{8}([.0-9]{7})? /, style: styles.bold},
            ]}>
            {logs}
          </ParsedText>
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input}
            placeholder="command to execute"
            onChangeText={text => {this.command = text;}}
            onSubmitEditing={this.execCommand.bind(this)}/>
          <Text style={styles.inputText} onPress={this.execCommand.bind(this)}>Execute</Text>
        </View>
      </View>
    );
  }

  handleContainerChange(container) {
    this.setState({container, loading: true});
  }

  execCommand() {
    PodsActions.execPodCommand({cluster: this.props.cluster, pod: this.props.pod, command: this.command, container: this.state.container});
  }
}
