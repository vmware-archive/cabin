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
import ListItem from 'components/commons/ListItem';
import ActionSheetUtils from 'utils/ActionSheetUtils';
import GoogleCloudActions from 'actions/GoogleCloudActions';

import {
  StyleSheet,
  DeviceEventEmitter,
  View,
  ScrollView,
  Slider,
  Text,
  TouchableOpacity,
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
  },
});

export default class ClustersNewGoogleCreation extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      zone: '',
      description: 'created by Cabin',
      initialNodeCount: 3,
      masterAuth: {
        username: '',
        password: '',
      },
    };
  }

  componentDidMount() {
    this.submitListener = DeviceEventEmitter.addListener('ClustersNewGoogle:submit', this.onSubmit.bind(this));
  }

  componentWillUnmount() {
    this.submitListener.remove();
  }

  componentWillReceiveProps(newProps) {
    if (this.props.zones.isEmpty() && !newProps.zones.isEmpty()) {
      this.setState({zone: newProps.zones.getIn([0, 'description'])});
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps={true}>
          <ListHeader title="Cluster" style={{marginTop: 30}}/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} placeholder="Name"
            onChangeText={name => this.setState({name: name.toLowerCase()})}/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} placeholder="Description" defaultValue={this.state.description}
            onChangeText={description => this.setState({description})} />
          <ListItem isLast={true} renderTitle={() => {
            return (
              <TouchableOpacity style={styles.zone} onPress={this.showZones.bind(this)}>
                <Text style={{fontSize: 16}}>{this.state.zone}</Text>
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
    const { zone, ...cluster } = this.state;
    const { projectId } = this.props;

    if (!cluster.masterAuth.username && !cluster.masterAuth.password) {
      cluster.masterAuth = undefined;
    }
    GoogleCloudActions.createCluster(projectId, zone, cluster).then(() => {
      GoogleCloudActions.getClusters(projectId);
      this.props.navigator.pop();
    });
  }
}
