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
import SwipeOut from 'react-native-swipeout';
import Colors from 'styles/Colors';
import AltContainer from 'alt-container';
import ClustersActions from 'actions/ClustersActions';
import NavigationActions from 'actions/NavigationActions';
import ClustersRoutes from 'routes/ClustersRoutes';
import StatusView from 'components/commons/StatusView';
import ActionSheetUtils from 'utils/ActionSheetUtils';

const { PropTypes } = React;
const {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 4,
    marginHorizontal: 8,
    marginVertical: 8,
    borderColor: Colors.BORDER,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    borderColor: Colors.BORDER,
    borderBottomWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
  },
  namespace: {
    fontSize: 14,
    opacity: 0.5,
    marginTop: 2,
    marginLeft: 12,
    marginBottom: -8,
  },
  stats: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    color: Colors.GRAY,
    textAlign: 'center',
  },
  moreIcon: {
    tintColor: Colors.GRAY,
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginLeft: 10,
    marginRight: -6,
  },
});

class Counter extends Component {
  render() {
    return <Text style={styles.statItem}>{this.props.value}</Text>;
  }
}

export default class ClusterItem extends Component {

  static propTypes = {
    cluster: PropTypes.instanceOf(Immutable.Map).isRequired,
  }

  render() {
    const { cluster } = this.props;
    const buttons = [
      { text: intl('edit'), backgroundColor: Colors.YELLOW, underlayColor: Colors.YELLOW, onPress: this.handleEdit.bind(this)},
      { text: intl('delete'), backgroundColor: Colors.RED, underlayColor: Colors.RED, onPress: this.handleDelete.bind(this)},
    ];
    return (
      <SwipeOut ref="swipeOut" right={buttons} backgroundColor="transparent" autoClose={true}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.innerContainer} onPress={this.props.onPress} onLongPress={this.handleLongPress.bind(this)}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {cluster.get('name')}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <StatusView status={cluster.get('status')} />
                <TouchableOpacity onPress={this.showActionSheet.bind(this)}>
                  <Image source={require('images/more.png')} style={styles.moreIcon} />
                </TouchableOpacity>
              </View>
            </View>
            {cluster.get('currentNamespace') && <Text style={styles.namespace}>Namespace: {cluster.get('currentNamespace')}</Text>}
            {this.renderCounters()}
          </TouchableOpacity>
        </View>
      </SwipeOut>
    );
  }

  renderCounters() {
    const entities = alt.stores.SettingsStore.getEntitiesToDisplay().take(3);
    const counters = entities.map(entity => {
      return (
        <AltContainer key={entity.get('name')} stores={{
          value: () => this.countForEntity(entity)}}>
          <Counter value=".."/>
        </AltContainer>
      );
    });
    return <View style={styles.stats}>{counters}</View>;
  }

  countForEntity(entity) {
    const { cluster } = this.props;
    switch (entity.get('name')) {
      case 'nodes':
        return { store: alt.stores.NodesStore,
          value: `${alt.stores.NodesStore.getNodes(cluster).size} ${intl('nodes')}`};
      case 'services':
        return { store: alt.stores.ServicesStore,
          value: `${alt.stores.ServicesStore.getServices(cluster).size} ${intl('services')}`};
      case 'replications':
        return { store: alt.stores.ReplicationsStore,
          value: `${alt.stores.ReplicationsStore.getReplications(cluster).size} ${intl('replications_short')}`};
      case 'deployments':
        return { store: alt.stores.DeploymentsStore,
          value: `${alt.stores.DeploymentsStore.getDeployments(cluster).size} ${intl('deployments')}`};
      case 'pods':
      default:
        return { store: alt.stores.PodsStore,
          value: `${alt.stores.PodsStore.getPods(cluster).size} ${intl('pods')}`};
    }
  }

  handleLongPress() {
    this.showActionSheet();
  }

  showActionSheet() {
    const options = [
      {title: intl('cancel')},
      {title: intl('edit'), onPress: this.handleEdit.bind(this)},
      {title: intl('delete'), onPress: this.handleDelete.bind(this), destructive: true},
    ];
    ActionSheetUtils.showActionSheetWithOptions(options);
  }

  handleDelete() {
    Alert.alert(
      intl('cluster_remove_title'),
      intl('cluster_remove_subtitle'),
      [
        {text: intl('cancel'), style: 'cancel', onPress: () => {}},
        {text: intl('yes'), onPress: () => {
          ClustersActions.removeCluster(this.props.cluster);
        }},
      ],
    );
  }

  handleEdit() {
    NavigationActions.push(ClustersRoutes.getClustersNewRoute(this.props.cluster));
  }

}
