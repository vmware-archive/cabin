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
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  DeviceEventEmitter,
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
});

export default class PodsLogs extends Component {

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

  componentDidMount() {
    this.refreshListener = DeviceEventEmitter.addListener('logs:refresh', () => this.refresh(true));
    this.refresh(false);
  }

  componentWillUnmount() {
    clearTimeout(this.refreshTimeout);
    this.refreshListener.remove();
  }

  render() {
    const { logs, pod, cluster } = this.props;
    const { container } = this.state;
    return (
      <View style={styles.container}>
        <PodsContainerPicker loading={this.state.statusBarLoading} pod={pod} cluster={cluster} selectedContainer={container} onChangeContainer={this.handleContainerChange.bind(this)}/>
        {this.state.loading ?
          <ActivityIndicator style={{flex: 1}}/> :
          <ScrollView ref="scrollView" style={styles.list} onRefresh={this.refresh.bind(this)}
            onLayout={(e) => { this.scrollViewHeight = e.nativeEvent.layout.height; }}
            onContentSizeChange={(width, height) => {
              if (height > this.scrollViewHeight) {
                this.refs.scrollView.scrollTo({y: height - this.scrollViewHeight});
              }
            }}>
            <ParsedText style={styles.logs}
              parse={[
                {pattern: /[0-9\/]{10} [0-9:]{8} [a-zA-Z0-9]+:/, style: styles.bold},
              ]}>
              {logs}
            </ParsedText>
          </ScrollView>
        }
      </View>
    );
  }

  launchTimeout() {
    clearTimeout(this.refreshTimeout);
    this.refreshTimeout = setTimeout(() => {
      this.refresh(true);
    }, 5000);
  }

  refresh(loading) {
    loading && this.setState({statusBarLoading: true});
    clearTimeout(this.refreshTimeout);
    PodsActions.fetchPodLogs({pod: this.props.pod, cluster: this.props.cluster, container: this.state.container}).then(() => {
      this.setState({loading: false, statusBarLoading: false});
      this.launchTimeout();
    });
  }

  handleContainerChange(container) {
    this.setState({container, loading: true});
    clearTimeout(this.refreshTimeout);
    this.refresh(false);
  }
}
