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
import ListInputItem from 'components/commons/ListInputItem';
import ListHeader from 'components/commons/ListHeader';
import ClustersActions from 'actions/ClustersActions';
import NavigationActions from 'actions/NavigationActions';
import ScrollView from 'components/commons/ScrollView';
import AlertUtils from 'utils/AlertUtils';
import {GoogleSignin} from 'react-native-google-signin';
import GoogleCloudActions from 'actions/GoogleCloudActions';
import ClustersRoutes from 'routes/ClustersRoutes';

const { PropTypes } = React;

const {
  View,
  Image,
  Text,
  ActivityIndicator,
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
  loader: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0, right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center', justifyContent: 'center',
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
        url: 'https://',
        name: '',
        username: '',
        password: '',
        token: '',

        googleUser: null,
        loading: false,
      };
    }
  }

  componentDidMount() {
    this.submitListener = DeviceEventEmitter.addListener('ClustersNew:submit', this.onSubmit.bind(this));
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      iosClientId: '260396395869-fpar03ln0q3lqmtou94n1iu38ecdok64.apps.googleusercontent.com',
    });
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
          {this.renderGoogle()}
          <ListHeader title="Manual cluster entry" style={{marginTop: 20}}/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} defaultValue={this.state.url} placeholder="URL"
            onChangeText={url => this.setState({url})}/>
          <ListInputItem defaultValue={this.state.name} placeholder="Optional name"
            onChangeText={name => this.setState({name})} isLast={true}/>
          <ListHeader title="Authentication" style={{marginTop: 20}}/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} defaultValue={this.state.username} placeholder="Username"
            onChangeText={username => this.setState({username})}/>
          <ListInputItem secureTextEntry={true} autoCapitalize="none" autoCorrect={false} defaultValue={this.state.password} placeholder="Password"
            onChangeText={password => this.setState({password})} isLast={true}/>
          <ListHeader title="Or"/>
          <ListInputItem style={{marginBottom: 20}} autoCapitalize="none" autoCorrect={false} defaultValue={this.state.token} placeholder="Access Token"
            onChangeText={token => this.setState({token})} isLast={true}/>
        </ScrollView>
        {this.state.loading && <ActivityIndicator style={styles.loader} color={Colors.WHITE} size="large"/>}
      </View>
    );
  }

  renderGoogle() {
    if (this.props.cluster) {
      // Don't show Google cluster creation when editing cluster
      return false;
    }
    return [
      <ListHeader key="title" title="" style={{marginTop: -10}} />,
      <ListItem key="action" title="Add cluster from Google GKE" isLast={true} onPress={this.signInGoogle.bind(this)} renderDetail={() =>
        <Image source={require('images/google.png')}
          style={{width: 30, height: 30, marginTop: -6}}/>
      }/>,
      (<View key="border" style={{height: 30, marginTop: 20, flexDirection: 'row', alignItems: 'center'}}>
        <View style={{height: 1, flex: 1, backgroundColor: '#BBBBBB'}}/>
        <Text style={{marginHorizontal: 10, color: Colors.GRAY}}>{'Or'}</Text>
        <View style={{height: 1, flex: 1, backgroundColor: '#BBBBBB'}}/>
      </View>),
    ];
  }

  signInGoogle() {
    this.setState({loading: true});
    GoogleCloudActions.signIn().then(() => {
      return GoogleCloudActions.getProjects();
    }).then(() => {
      this.setState({loading: false});
      const projects = alt.stores.GoogleCloudStore.getProjects();
      if (projects.size > 0) {
        GoogleCloudActions.getClusters(projects.getIn([0, 'projectId']));
        this.props.navigator.replace(ClustersRoutes.getClustersGoogleRoute());
      }
    }).catch(() => {
      this.setState({loading: false});
      AlertUtils.showError();
    });
  }

  onSubmit() {
    if (!/(ftp|https?):\/\/[^ "]+$/.test(this.state.url)) {
      AlertUtils.showWarning({message: intl('cluster_new_wrong_url')});
      return;
    }
    if (this.props.cluster) {
      ClustersActions.editCluster({cluster: this.props.cluster, params: Immutable.fromJS({...this.state})});
    } else {
      ClustersActions.addCluster({...this.state});
    }
    setTimeout(() => {
      const cluster = alt.stores.ClustersStore.get(this.state.url);
      cluster && ClustersActions.checkCluster(cluster);
    }, 1000);
    NavigationActions.pop();
  }

}
