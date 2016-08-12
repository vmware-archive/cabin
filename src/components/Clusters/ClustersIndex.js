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
import CollectionView from 'components/commons/CollectionView';
import ClustersRoutes from 'routes/ClustersRoutes';
import Colors from 'styles/Colors';
import ClustersItem from 'components/Clusters/ClustersItem';
import AltContainer from 'alt-container';
import ClustersActions from 'actions/ClustersActions';
import NavigationActions from 'actions/NavigationActions';

const {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  InteractionManager,
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    backgroundColor: Colors.BACKGROUND,
  },
  emptyImage: {
    height: 140,
    width: 140,
    resizeMode: 'contain',
    marginTop: -30,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    color: Colors.BLACK,
    marginTop: 20,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.GRAY,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyButton: {
    backgroundColor: Colors.BLUE,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  emptyAction: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '400',
  },
});

export default class ClustersIndex extends Component {

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => this.checkClusters());
  }

  componentWillUnmount() {
    clearTimeout(this.checkTimeout);
  }

  render() {
    return (
      <View style={styles.flex}>
        <AltContainer stores={{
          list: () => {
            return {
              store: alt.stores.ClustersStore,
              value: alt.stores.ClustersStore.getClusters(),
            };
          }}}>
          <CollectionView style={styles.list}
            contentInset={{bottom: 40}}
            scrollIndicatorInsets={{bottom: 0}}
            contentContainerStyle={styles.listContent}
            list={alt.stores.ClustersStore.getClusters()}
            renderRow={this.renderRow.bind(this)}
            renderEmpty={this.renderEmptyState.bind(this)}
            onRefresh={this.handleRefresh.bind(this)}
          />
        </AltContainer>
      </View>
    );
  }

  renderRow(cluster) {
    return (
      <ClustersItem
        cluster={cluster}
        onPress={() => this.onPressItem(cluster)}
      />
    );
  }

  renderEmptyState() {
    return (
      <View style={styles.emptyContainer}>
        <Image style={styles.emptyImage} source={require('images/cubes.png')} />
        <Text style={styles.emptyTitle}>{intl('clusters_empty_title')}</Text>
        <Text style={styles.emptySubtitle}>{intl('clusters_empty_subtitle')}</Text>
        <TouchableOpacity style={styles.emptyButton} onPress={() => {
          NavigationActions.push(ClustersRoutes.getClustersNewRoute());
        }}>
          <Text style={styles.emptyAction}>{intl('clusters_empty_action')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  handleRefresh() {
    this.checkClusters();
  }

  checkClusters() {
    ClustersActions.checkClusters().then(() => {
      this.checkTimeout = setTimeout(() => {
        this.checkClusters();
      }, 10000);
    });
  }

  onPressItem(cluster) {
    ClustersActions.fetchClusterEntities(cluster);
    ClustersActions.fetchNamespaces(cluster);
    this.props.navigator.push(ClustersRoutes.getClusterShowRoute(cluster));
  }
}
