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
import ListHeader from 'components/commons/ListHeader';
import ClustersActions from 'actions/ClustersActions';
import NavigationActions from 'actions/NavigationActions';
import { PropTypes } from 'react';

const {
  View,
  ScrollView,
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

export default class ClustersNew extends Component {

  static propTypes = {
    cluster: PropTypes.instanceOf(Immutable.Map), // if provided, it will edit cluster instead of create new one
  }

  constructor(props) {
    super(props);
    const { cluster } = props;
    if (cluster) {
      this.state = cluster.toJS();
    } else {
      this.state = {
        url: 'http://',
        name: '',
        username: '',
        password: '',
        token: '',
      };
    }
  }

  componentDidMount() {
    this.submitListener = DeviceEventEmitter.addListener('ClustersNew:submit', this.onSubmit.bind(this));
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
          <ListHeader title="Cluster info"/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} defaultValue={this.state.url} placeholder="URL"
            onChangeText={url => this.setState({url})}/>
          <ListInputItem defaultValue={this.state.name} placeholder="Optional name"
            onChangeText={name => this.setState({name})} isLast={true}/>

          <ListHeader title="Authentication" style={{marginTop: 30}}/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} defaultValue={this.state.username} placeholder="Username"
            onChangeText={username => this.setState({username})}/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} defaultValue={this.state.password} placeholder="Password"
            onChangeText={password => this.setState({password})} isLast={true}/>
          {/* <ListHeader title="Or"/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} defaultValue={this.state.username} placeholder="Access Token"
            onChangeText={token => this.setState({token})} isLast={true}/>*/}

        </ScrollView>
      </View>
    );
  }

  onSubmit() {
    if (this.props.cluster) {
      ClustersActions.editCluster({cluster: this.props.cluster, params: Immutable.fromJS({...this.state})});
    } else {
      ClustersActions.addCluster({...this.state});
    }
    setTimeout(() => {
      const cluster = alt.stores.ClustersStore.get(this.state.url);
      cluster && ClustersActions.checkCluster(cluster);
    }, 1000);
    NavigationActions.popRoute();
  }

}
