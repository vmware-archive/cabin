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
import SwipeRow from 'components/commons/SwipeRow';
import Colors from 'styles/Colors';
import AltContainer from 'alt-container';
import ClustersActions from 'actions/ClustersActions';
import NavigationActions from 'actions/NavigationActions';
import DeploymentsActions from 'actions/DeploymentsActions';
import ClustersRoutes from 'routes/ClustersRoutes';
import StatusView from 'components/commons/StatusView';
import ActionSheetUtils from 'utils/ActionSheetUtils';
import ClustersUtils from 'utils/ClustersUtils';
import EntitiesUtils from 'utils/EntitiesUtils';
import AlertUtils from 'utils/AlertUtils';

const { PropTypes } = React;
const {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Platform,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
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
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    borderColor: Colors.BORDER,
    borderBottomWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  compactHeader: {
    paddingVertical: 8,
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
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactStats: {
    paddingVertical: 6,
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
    compactSize: PropTypes.bool,
    onSwipeStart: PropTypes.func,
    onSwipeEnd: PropTypes.func,
  }

  render() {
    const { cluster } = this.props;
    const showReport = !ClustersUtils.hasSpartakusDeployment(cluster);
    const buttons = [];
    showReport && buttons.push({ text: intl('report'), style: {backgroundColor: Colors.BLUE, marginVertical: 8}, textStyle: {color: Colors.WHITE}, onPress: this.handleReport.bind(this)});
    buttons.push({ text: intl('edit'), style: {backgroundColor: Colors.YELLOW, marginVertical: 8}, textStyle: {color: Colors.WHITE}, onPress: this.handleEdit.bind(this)});
    buttons.push({ text: intl('delete'), style: {backgroundColor: Colors.RED, marginVertical: 8}, textStyle: {color: Colors.WHITE}, onPress: this.handleDelete.bind(this)});
    const Container = Platform.OS === 'ios' ? SwipeRow : View;
    return (
      <Container
        onSwipeStart={this.props.onSwipeStart} onSwipeEnd={this.props.onSwipeEnd}
        right={Platform.OS === 'ios' ? buttons : undefined} backgroundColor="transparent" autoClose={true}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.innerContainer} onPress={this.props.onPress} onLongPress={this.handleLongPress.bind(this)}>
            <View style={[styles.header, this.props.compactSize && styles.compactHeader]}>
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
      </Container>
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
    return <View style={[styles.stats, this.props.compactSize && styles.compactStats]}>{counters}</View>;
  }

  countForEntity(entity) {
    const { cluster } = this.props;
    switch (entity.get('name')) {
      case 'helmreleases':
        return { store: alt.stores.ReleasesStore,
          value: `${alt.stores.ReleasesStore.getAll(cluster).size} ${intl('helmreleases')}`};
      default:
        const store = EntitiesUtils.storeForType(entity.get('name'));
        return { store,
          value: `${store.getAll(cluster).size} ${intl(entity.get('name'))}`};
    }
  }

  handleLongPress() {
    this.showActionSheet();
  }

  showActionSheet() {
    const showReport = !ClustersUtils.hasSpartakusDeployment(this.props.cluster);
    const options = [{title: intl('cancel')}];
    showReport && options.push({title: intl('report'), onPress: this.handleReport.bind(this)});
    options.push({title: intl('edit'), onPress: this.handleEdit.bind(this)});
    options.push({title: intl('delete'), onPress: this.handleDelete.bind(this), destructive: true});
    ActionSheetUtils.showActionSheetWithOptions({options});
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
    NavigationActions.push(ClustersRoutes.getClusterNewRoute(this.props.cluster));
  }

  handleReport() {
    AlertUtils.showInfo({
      message: intl('cluster_report_success'),
      duration: 30000,
    });
    DeploymentsActions.createDeployment({
      cluster: this.props.cluster,
      name: 'spartakus',
      image: 'gcr.io/google_containers/spartakus-amd64:v1.0.0',
      namespace: 'default',
      args: EntitiesUtils.spartakusArgs(),
    }).then(() => {
      AlertUtils.showSuccess({message: intl('cluster_report_success')});
    }).catch(e => {
      AlertUtils.showError({message: e.message});
    });
  }

}
