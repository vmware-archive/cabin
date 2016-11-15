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
import Sizes from 'styles/Sizes';
import ListHeader from 'components/commons/ListHeader';
import HeaderPicker from 'components/commons/HeaderPicker';
import CollectionView from 'components/commons/CollectionView';
import GoogleCloudActions from 'actions/GoogleCloudActions';
import ClustersActions from 'actions/ClustersActions';
import FAB from 'components/commons/FAB';
import Alert from 'utils/Alert';
import StatusView from 'components/commons/StatusView';
import AlertUtils from 'utils/AlertUtils';
import LocalesUtils from 'utils/LocalesUtils';
import ClustersRoutes from 'routes/ClustersRoutes';
import AltContainer from 'alt-container';

const { PropTypes } = React;

const {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} = ReactNative;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  list: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  listContent: {
    marginTop: 20,
  },
  clusterContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 4,
    marginHorizontal: 8,
    marginVertical: 8,
    borderColor: Colors.BORDER,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    borderColor: Colors.BORDER,
    borderBottomWidth: 1,
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: Sizes.MEDIUM,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.5,
  },
});

const dateOptions = {
  year: 'numeric', month: 'numeric', day: 'numeric',
  hour: 'numeric', minute: 'numeric', second: 'numeric',
  hour12: false,
};

export default class ClustersNewGoogle extends Component {

  static propTypes = {
    projects: PropTypes.instanceOf(Immutable.List),
  }

  constructor() {
    super();
    this.state = {
      selectedProjectIndex: 0,
    };
  }

  render() {
    const choices = this.props.projects.map(p => p.get('name'));
    const projectId = this.props.projects.getIn([this.state.selectedProjectIndex, 'projectId']);

    return (
      <View style={styles.flex}>
        <HeaderPicker
          prefix={'Project: '}
          choices={choices}
          selectedIndex={this.state.selectedProjectIndex}
          onChange={(index) => {
            GoogleCloudActions.getClusters(this.props.projects.getIn([index, 'projectId']));
            this.setState({selectedProjectIndex: index});
          }}/>
        <AltContainer stores={{
          list: () => {
            return {
              store: alt.stores.GoogleCloudStore,
              value: alt.stores.GoogleCloudStore.getClusters(projectId),
            };
          }}}>
          <CollectionView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            list={alt.stores.GoogleCloudStore.getClusters(projectId)}
            onRefresh={this.onRefresh.bind(this)}
            renderRow={this.renderItem.bind(this)}
            renderHeader={() => {
              return <ListHeader title="Tap to add to cabin" style={{borderBottomWidth: 0, marginBottom: -6}}/>;
            }}/>
        </AltContainer>
        <FAB
          backgroundColor={Colors.BLUE}
          onPress={this.createCluster.bind(this)} />
      </View>
    );
  }

  renderItem(cluster) {
    return (
      <TouchableOpacity style={styles.clusterContainer} onPress={() => this.submitCluster(cluster)}>
        <View style={styles.header}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.title}>{cluster.get('name')}</Text>
            <StatusView status={cluster.get('status')} />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.subtitle}>{cluster.get('zone')}</Text>
            <Text style={styles.subtitle}>{LocalesUtils.getLocalizedDate(new Date(cluster.get('createTime')), dateOptions)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  onRefresh() {
    GoogleCloudActions.getClusters(this.props.projects.getIn([this.state.selectedProjectIndex, 'projectId']));
  }

  submitCluster(cluster) {
    if (!cluster.get('endpoint')) {
      this.onRefresh();
      Alert.alert('Add cluster', 'Can\'t add this cluster to cabin, it has no url yet. \n Please try again in few seconds.', [
        {'text': intl('ok')},
      ]);
      return;
    } else if (alt.stores.ClustersStore.get(`https://${cluster.get('endpoint')}:443`)) {
      AlertUtils.showWarning({message: 'You\'ve already added this cluster to Cabin'});
      return;
    }
    Alert.alert('Add cluster', `Do you want to add cluster '${cluster.get('name')}' from GKE to Cabin ?`, [
      {'text': intl('cancel')},
      {'text': intl('ok'), onPress: () => this.addCluster(cluster)},
    ]);
  }

  addCluster(googleCluster) {
    const cluster = Immutable.fromJS({
      url: `https://${googleCluster.get('endpoint')}:443`,
      name: googleCluster.get('name'),
      username: googleCluster.getIn(['masterAuth', 'username']),
      password: googleCluster.getIn(['masterAuth', 'password']),
    });
    ClustersActions.addCluster(cluster.toJS());
    AlertUtils.showSuccess({message: 'Cluster added to Cabin'});
    setTimeout(() => {
      ClustersActions.checkCluster(cluster);
    }, 1000);
  }

  createCluster() {
    const projectId = this.props.projects.getIn([this.state.selectedProjectIndex, 'projectId']);
    GoogleCloudActions.getZones(projectId);
    this.props.navigator.push(ClustersRoutes.getClusterGoogleCreationRoute(projectId));
  }
}
