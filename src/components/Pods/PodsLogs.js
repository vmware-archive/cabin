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
import AltContainer from 'alt-container';

const {
  View,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} = ReactNative;

import PropTypes from 'prop-types';

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

export class PodsLogsContainer extends Component {

  static navigatorButtons = {
    rightButtons: [{
      id: 'refresh',
      icon: require('images/refresh.png'),
    }],
  };

  render() {
    const { pod, cluster, navigator, container } = this.props;
    return (
      <AltContainer
        stores={{
          logs: () => {
            return {
              store: alt.stores.PodsStore,
              value: alt.stores.PodsStore.getLogs({ pod, cluster }),
            };
          },
        }}
      >
        <PodsLogs
          logs={alt.stores.PodsStore.getLogs({ pod, cluster })}
          pod={pod}
          container={container}
          cluster={cluster}
          navigator={navigator}
        />
      </AltContainer>
    );
  }
}

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
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    this.refresh(false);
  }

  componentWillUnmount() {
    clearTimeout(this.refreshTimeout);
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress' && event.id === 'refresh') {
      this.refresh(true);
    }
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
