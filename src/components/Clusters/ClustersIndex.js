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
import Colors, { defaultNavigatorStyle } from 'styles/Colors';
import ClustersItem from 'components/Clusters/ClustersItem';
import EmptyView from 'components/commons/EmptyView';
import AltContainer from 'alt-container';
import ClustersActions from 'actions/ClustersActions';
import NavigationActions from 'actions/NavigationActions';
import FAB from 'components/commons/FAB';

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

  static navigatorStyle = defaultNavigatorStyle;

  static navigatorButtons = {
    rightButtons: [{
      id: 'add',
      icon: require('images/add.png'),
    }],
  };

  constructor(props) {
    super(props);
    this.state = {
      scrollEnabled: true,
    };
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    this.navigationEventListener = DeviceEventEmitter.addListener('clusters:navigation', this.handleShowCluster.bind(this));
    InteractionManager.runAfterInteractions(() => this.checkClusters());
  }

  componentWillUnmount() {
    this.navigationEventListener.remove();
    clearTimeout(this.checkTimeout);
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress' && event.id === 'add') {
      this.props.navigator.showModal({
        screen: 'cabin.ClustersNew',
        title: 'New Cluster',
      });
    }
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
                onPress={() => NavigationActions.push(ClustersRoutes.getClusterNewRoute())}
              />}
            onRefresh={this.handleRefresh.bind(this)}
          />
        </AltContainer>
        {Platform.OS === 'android' &&
          <FAB
            backgroundColor={Colors.BLUE}
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
    clearTimeout(this.checkTimeout);
    ClustersActions.checkClusters().then(() => {
      this.checkTimeout = setTimeout(() => {
        this.checkClusters();
      }, 10000);
    });
  }

  handleShowCluster(cluster) {
    this.props.navigator.popToRoot();
    InteractionManager.runAfterInteractions(() => {
      this.onSelectCluster(cluster);
    });
  }

  onSelectCluster(cluster) {
    ClustersActions.fetchClusterEntities(cluster);
    ClustersActions.fetchNamespaces(cluster);
    this.props.navigator.push({
      screen: 'cabin.ClustersShow',
      title: cluster.get('name'),
      backButtonTitle: '',
      passProps: { cluster },
    });
  }
}
