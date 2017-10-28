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
import AltContainer from 'alt-container';
import Colors, { defaultNavigatorStyle } from 'styles/Colors';
import ListInputItem from 'components/commons/ListInputItem';
import ListHeader from 'components/commons/ListHeader';
import ListItem from 'components/commons/ListItem';
import ActionSheetUtils from 'utils/ActionSheetUtils';
import SnackbarUtils from 'utils/SnackbarUtils';
import GoogleCloudActions from 'actions/GoogleCloudActions';
import ScrollView from 'components/commons/ScrollView';

import {
  StyleSheet,
  View,
  Slider,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  sliderItem: {
    height: 75,
  },
  detail: {
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  zone: {
    flex: 1,
    justifyContent: 'center',
    height: 55,
  },
  zoneLabel: {
    color: Colors.GRAY,
    marginTop: -10,
    marginBottom: 4,
  },
  zoneSubtitle: {
    fontSize: 16,
  },
  loader: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0, right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
});

export class ClustersNewGoogleContainer extends Component {

  static navigatorStyle = defaultNavigatorStyle;

  static navigatorButtons = {
    leftButtons: [{
      id: 'cancel',
      title: intl('cancel'),
    }],
    rightButtons: [Platform.select({
      ios: {
        id: 'done',
        title: intl('done'),
      },
      android: {
        id: 'done',
        icon: require('images/done.png'),
      },
    })],
  };

  render() {
    return (
      <AltContainer stores={{
        zones: () => {
          return {
            store: alt.stores.GoogleCloudStore,
            value: alt.stores.GoogleCloudStore.getZones(),
          };
        }}}>
        <ClustersNewGoogleCreation navigator={navigator} projectId={this.props.projectId} />
      </AltContainer>
    );
  }
}

export default class ClustersNewGoogleCreation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      name: '',
      zone: props.zones ? props.zones.getIn([0, 'description']) : '',
      description: 'created by Cabin',
      initialNodeCount: 3,
      masterAuth: {
        username: '',
        password: '',
      },
    };
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.zones && !nextProps.zones.isEmpty()) {
      this.setState({zone: nextProps.zones.getIn([0, 'description'])});
    }
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'cancel':
        this.props.navigator.dismissAllModals();
        break;
      case 'done':
        this.onSubmit();
        break;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps="always">
          <ListHeader title="Cluster" style={{marginTop: 30}}/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} placeholder="Name"
            onChangeText={name => this.setState({name: name.toLowerCase()})}/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} placeholder="Description" defaultValue={this.state.description}
            onChangeText={description => this.setState({description})} />
          <ListItem isLast={true} renderTitle={() => {
            return (
              <TouchableOpacity style={styles.zone} onPress={this.showZones.bind(this)}>
                <Text style={styles.zoneLabel}>{'Zone'}</Text>
                <Text style={styles.zoneSubtitle}>{this.state.zone}</Text>
              </TouchableOpacity>
            );
          }} />
          <ListHeader title="Authentication" style={{marginTop: 30}} />
          <ListInputItem autoCapitalize="none" autoCorrect={false} placeholder="Username"
            onChangeText={username => this.setState({masterAuth: {...this.state.masterAuth, username}})}/>
          <ListInputItem secureTextEntry={true} autoCapitalize="none" autoCorrect={false} placeholder="Password"
            onChangeText={password => this.setState({masterAuth: {...this.state.masterAuth, password}})} isLast={true}/>
          <ListHeader title="Initial Node count" style={{marginTop: 30}}/>
          <ListItem style={styles.sliderItem} isLast={true} renderTitle={() => {
            return (
              <View style={styles.container}>
                <View style={styles.row}>
                  <Text style={styles.detail}>{this.state.initialNodeCount}</Text>
                </View>
                <Slider style={styles.slider} minimumValue={0} maximumValue={24} step={1} value={this.state.initialNodeCount}
                  onValueChange={(initialNodeCount) => this.setState({initialNodeCount})}
                  onSlidingComplete={(initialNodeCount) => this.setState({initialNodeCount})}/>
              </View>
            );
          }} />
        </ScrollView>
        {this.state.loading && <ActivityIndicator style={styles.loader} color={Colors.WHITE} size="large"/>}
      </View>
    );
  }

  showZones() {
    const { zones } = this.props;

    if (zones.isEmpty()) {
      return;
    }
    let options = [{title: intl('cancel')}];
    options = options.concat(zones.map(zone => {
      return {title: zone.get('description'), onPress: () => this.setState({zone: zone.get('description')})};
    }).toJS());
    ActionSheetUtils.showActionSheetWithOptions({options});
  }

  onSubmit() {
    if (this.state.loading) { return; }
    this.setState({loading: true});
    const { zone, ...cluster } = this.state;
    cluster.loading = undefined;
    const { projectId } = this.props;

    if (!cluster.masterAuth.username && !cluster.masterAuth.password) {
      cluster.masterAuth = undefined;
    }
    GoogleCloudActions.createCluster(projectId, zone, cluster).then(() => {
      SnackbarUtils.showSuccess({ title: 'The cluster has been created on GKE, you can now add it to cabin' });
      GoogleCloudActions.getClusters(projectId);
      Platform.OS === 'ios' ? this.props.navigator.dismissModal() : this.props.navigator.pop();
    }).catch(e => {
      SnackbarUtils.showError(e && e.message && {title: e.message});
      this.setState({loading: false});
    });
  }
}
