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
import EmptyView from 'components/commons/EmptyView';
import AltContainer from 'alt-container';
import ClustersActions from 'actions/ClustersActions';
import ActionButton from 'react-native-action-button';
import NavigationActions from 'actions/NavigationActions';

const {
  View,
  InteractionManager,
  Platform,
  StyleSheet,
  DeviceEventEmitter,
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

  constructor() {
    super();
    this.state = {
      scrollEnabled: true,
    };
  }

  componentDidMount() {
    this.navigationEventListener = DeviceEventEmitter.addListener('clusters:navigation', this.handleShowCluster.bind(this));
    InteractionManager.runAfterInteractions(() => this.checkClusters());
  }

  componentWillUnmount() {
    this.navigationEventListener.remove();
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
            ref="CollectionView"
            scrollEnabled={this.state.scrollEnabled}
            contentInset={{bottom: 40}}
            scrollIndicatorInsets={{bottom: 0}}
            contentContainerStyle={styles.listContent}
            list={alt.stores.ClustersStore.getClusters()}
            renderRow={this.renderRow.bind(this)}
            renderEmpty={() => <EmptyView
                image={require('images/cubes.png')}
                title={intl('clusters_empty_title')}
                subtitle={intl('clusters_empty_subtitle')}
                actionTitle={intl('clusters_empty_action')}
                onPress={() => NavigationActions.push(ClustersRoutes.getClustersNewRoute())}
              />}
            onRefresh={this.handleRefresh.bind(this)}
          />
        </AltContainer>
        {Platform.OS === 'android' &&
          <ActionButton
            buttonColor={Colors.BLUE}
            offsetY={16} offsetX={16}
            onPress={() => this.props.navigator.push(ClustersRoutes.getClusterNewRoute())} />}
      </View>
    );
  }

  renderRow(cluster) {
    const isCompactSize = alt.stores.ClustersStore.getClusters().size > 5;
    return (
      <ClustersItem
        cluster={cluster}
        compactSize={isCompactSize}
        onPress={() => this.onSelectCluster(cluster)}
        onSwipeStart={() => this.setState({scrollEnabled: false})}
        onSwipeEnd={() => this.setState({scrollEnabled: true})}
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

  handleShowCluster(cluster) {
    this.props.navigator.popToTop();
    InteractionManager.runAfterInteractions(() => {
      this.onSelectCluster(cluster);
    });
  }

  onSelectCluster(cluster) {
    ClustersActions.fetchClusterEntities(cluster);
    ClustersActions.fetchNamespaces(cluster);
    this.props.navigator.push(ClustersRoutes.getClusterShowRoute(cluster));
  }
}
