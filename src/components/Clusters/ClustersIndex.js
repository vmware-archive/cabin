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

const {
  View,
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
