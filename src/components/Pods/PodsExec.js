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
import ScrollView from 'components/commons/ScrollView';
import PodsContainerPicker from 'components/Pods/PodsContainerPicker';
import PodsActions from 'actions/PodsActions';

const {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  Dimensions,
  Animated,
} = ReactNative;

const { PropTypes } = React;

const styles = PStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLACK,
  },
  logs: {
    flex: 1,
    padding: 10,
    color: Colors.WHITE,
    marginBottom: 50,
  },
  bold: {
    fontWeight: '600',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 50,
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input2: {
    color: Colors.WHITE,
    flex: 1,
    height: 40,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    paddingLeft: 6,
    ios: {
      marginVertical: 8,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: Colors.BORDER,
    },
    android: {
      fontSize: 16,
    },
  },
  inputText: {
    color: Colors.BLUE,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  loader: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
  },
});

export default class PodsExec extends Component {

  static propTypes = {
    messages: PropTypes.instanceOf(Immutable.List),
    container: PropTypes.string,
    pod: PropTypes.instanceOf(Immutable.Map),
    cluster: PropTypes.instanceOf(Immutable.Map),
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      statusBarLoading: false,
      container: props.container || props.pod.getIn(['spec', 'containers', 0, 'name']),
      inputBottom: new Animated.Value(0),
    };
    this.keyboardHeight = 0;
    this.contentSizeHeight = 0;
    this.scrollViewHeight = Dimensions.get('window').height - 114;
  }

  render() {
    const { pod, cluster } = this.props;
    const { container } = this.state;
    const messages = this.props.messages.map(msg => {
      if (!msg.slice(-1).match(/\n/)) {
        return msg + '\n';
      }
      return msg;
    }).join('');
    return (
      <View style={styles.container}>
        <PodsContainerPicker pod={pod} cluster={cluster} selectedContainer={container} onChangeContainer={this.handleContainerChange.bind(this)}/>
        <ScrollView ref="scrollView" style={styles.list}
          onLayout={(e) => { this.scrollViewHeight = e.nativeEvent.layout.height; }}
          onKeyboardWillShow={(frames) => {
            this.showKeyboard(frames.endCoordinates.height);
          }}
          onKeyboardWillHide={() => {
            this.hideKeyboard();
          }}
          onContentSizeChange={(width, height) => {
            this.contentSizeHeight = height;
            if (height > this.scrollViewHeight) {
              this.refs.scrollView.scrollTo({y: height - this.scrollViewHeight + this.keyboardHeight});
            } else {
              this.refs.scrollView.scrollTo({y: 0});
            }
          }}>
          <Text style={styles.logs}>{messages}</Text>
        </ScrollView>
        <Animated.View style={[styles.inputContainer, {bottom: this.state.inputBottom}]}>
          <TextInput style={styles.input}
            ref="input"
            autoCapitalize="none" autoCorrect={false}
            placeholder="command to execute"
            onChangeText={text => {this.command = text;}}
            onSubmitEditing={this.execCommand.bind(this)}/>
            <View>
              <Text style={[styles.inputText, this.state.loading && {opacity: 0}]} onPress={this.execCommand.bind(this)}>Execute</Text>
              {this.state.loading && <ActivityIndicator style={styles.loader} color={Colors.BLUE}/>}
            </View>
        </Animated.View>
      </View>
    );
  }

  showKeyboard(height) {
    this.keyboardHeight = height;
    Animated.timing(this.state.inputBottom, {toValue: height - 50, duration: 250}).start();
    this.refs.scrollView.scrollTo({y: this.contentSizeHeight - this.scrollViewHeight + height});
  }

  hideKeyboard() {
    this.keyboardHeight = 0;
    Animated.timing(this.state.inputBottom, {toValue: 0, duration: 250}).start();
  }

  handleContainerChange(container) {
    this.setState({container});
  }

  execCommand() {
    if (this.state.loading) { return; }
    this.setState({loading: true});
    PodsActions.execPodCommand({cluster: this.props.cluster, pod: this.props.pod, command: this.command, container: this.state.container}).then(() => {
      this.refs.input.setNativeProps({text: ''});
      this.setState({loading: false});
    });
  }
}
