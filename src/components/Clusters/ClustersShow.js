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
import PropTypes from 'prop-types';
import EntitiesList from 'components/EntitiesList';
import EntitiesUtils from 'utils/EntitiesUtils';
import EntitiesActions from 'actions/EntitiesActions';
import AltContainer from 'alt-container';
import Colors, { defaultNavigatorStyle } from 'styles/Colors';
import SegmentedTabs from 'components/commons/SegmentedTabs';
import NamespacePicker from 'components/commons/NamespacePicker';
import DeployReleases from 'components/Deploy/DeployReleases';

const { View, Animated, StyleSheet, Platform } = ReactNative;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    borderColor: Colors.BORDER,
    borderBottomWidth: 1,
  },
  clusterStatus: {
    width: 40,
    height: 40,
    backgroundColor: Colors.GREEN,
  },
});

export class ClustersShowContainer extends Component {

  static navigatorStyle = defaultNavigatorStyle

  static navigatorButtons = {
    rightButtons: [{
      id: 'search',
      icon: require('images/search.png'),
    }],
  };

  componentDidMount() {
    this.props.navigator.setStyle({
      navBarCustomView: 'cabin.ClustersShow.Navbar',
      navBarCustomViewInitialProps: { clusterUrl: this.props.cluster.get('url') },
    });
  }

  render() {
    return (
      <AltContainer stores={{
        cluster: () => {
          return {
            store: alt.stores.ClustersStore,
            value: alt.stores.ClustersStore.get(this.props.cluster.get('url')),
          };
        },
        entitiesToDisplay: () => {
          return {
            store: alt.stores.SettingsStore,
            value: alt.stores.SettingsStore.getEntitiesToDisplay(),
          };
        }}}>
        <ClusterShow
          navigator={this.props.navigator}
          entitiesToDisplay={alt.stores.SettingsStore.getEntitiesToDisplay()}
          cluster={alt.stores.ClustersStore.get(this.props.cluster.get('url'))}
        />
      </AltContainer>
    );
  }
}

export default class ClusterShow extends Component {
  static propTypes = {
    cluster: PropTypes.instanceOf(Immutable.Map).isRequired,
    entitiesToDisplay: PropTypes.instanceOf(Immutable.List).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      animatedIndex: new Animated.Value(0),
      activePage: 0,
    };
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    const entitiesToDisplay = this.props.entitiesToDisplay.map(e =>
      e.get('name')
    );
    this.watchEntities(entitiesToDisplay.get(0));
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress' && event.id === 'search') {
      this.props.navigator.push({
        screen: 'cabin.ClustersSearch',
        passProps: { cluster: this.props.cluster },
      });
    }
  }

  watchEntities(entityType) {
    EntitiesActions.fetchEntities({
      cluster: this.props.cluster,
      entityType,
    }).then(() => {
      if (entityType === 'helmreleases') {
        return;
      }
      EntitiesActions.watchEntities({
        cluster: this.props.cluster,
        entityType,
      });
    });
  }

  render() {
    const entitiesToDisplay = this.props.entitiesToDisplay.map(e =>
      e.get('name')
    );
    const { cluster } = this.props;
    const active = entitiesToDisplay.get(this.state.activePage);
    return (
      <View style={styles.flex}>
        <View style={styles.header}>
          <NamespacePicker cluster={cluster} />
          <SegmentedTabs
            isScrollable={true}
            selectedIndex={this.state.animatedIndex}
            controls={entitiesToDisplay.map(e => intl(e))}
            onPress={i => {
              Animated.timing(this.state.animatedIndex, {
                toValue: i,
                duration: 300,
              }).start();
              this.setState({ activePage: i });
              this.watchEntities(entitiesToDisplay.get(i));
            }}
          />
        </View>
        {this.renderGeneralEntities(active)}
      </View>
    );
  }

  renderGeneralEntities(active) {
    const { cluster } = this.props;
    const entitiesToDisplay = this.props.entitiesToDisplay.map(e =>
      e.get('name')
    );
    return entitiesToDisplay.map(entityType => {
      if (active !== entityType) {
        return false;
      }
      if (entityType === 'helmreleases') {
        return this.renderHelmRelease();
      }
      const store = EntitiesUtils.storeForType(entityType);
      let onCreate;
      let actionColor;
      if (entityType === 'deployments') {
        onCreate = this.showDeploymentsNew.bind(this);
        actionColor = Colors.PURPLE;
      }
      if (entityType === 'services') {
        onCreate = this.showServicesNew.bind(this);
        actionColor = Colors.ORANGE;
      }
      if (entityType === 'horizontalpodautoscalers') {
        onCreate = this.showHPANew.bind(this);
        actionColor = Colors.GREEN2;
      }
      return (
        <AltContainer
          key={entityType}
          stores={{
            entities: () => {
              return {
                store,
                value: store.getAll(cluster),
              };
            },
            status: () => {
              return {
                store,
                value: store.getStatus(cluster),
              };
            },
          }}
        >
          <EntitiesList
            navigator={this.props.navigator}
            status={store.getStatus(cluster)}
            entities={store.getAll(cluster)}
            onPress={entity =>
              this.props.navigator.push(
                EntitiesUtils.getEntitiesShowRoute({
                  entity,
                  cluster,
                  entityType,
                })
              )}
            onRefresh={() =>
              EntitiesActions.fetchEntities({ cluster, entityType })}
            onDelete={entity =>
              EntitiesActions.deleteEntity({ cluster, entity, entityType })}
            onCreate={onCreate}
            actionColor={actionColor}
          />
        </AltContainer>
      );
    });
  }

  renderHelmRelease() {
    const { cluster } = this.props;
    return (
      <AltContainer
        key="helmreleases"
        stores={{
          releases: () => {
            return {
              store: alt.stores.ReleasesStore,
              value: alt.stores.ReleasesStore.getAll(cluster),
            };
          },
          status: () => {
            return {
              store: alt.stores.ReleasesStore,
              value: alt.stores.ReleasesStore.getStatus(cluster),
            };
          },
          error: () => {
            return {
              store: alt.stores.ReleasesStore,
              value: alt.stores.ReleasesStore.getError(cluster),
            };
          },
        }}
      >
        <DeployReleases
          cluster={cluster}
          releases={alt.stores.ReleasesStore.getAll(cluster)}
          status={alt.stores.ReleasesStore.getStatus(cluster)}
          error={alt.stores.ReleasesStore.getError(cluster)}
          navigator={this.props.navigator}
        />
      </AltContainer>
    );
  }

  showDeploymentsNew() {
    const { navigator } = this.props;
    const route = { screen: 'cabin.DeploymentsNew', title: intl('deployment_new'), passProps: {
      cluster: this.props.cluster,
    }};
    Platform.OS === 'ios' ? navigator.showModal(route) : navigator.push(route);
  }

  showServicesNew() {
    const { cluster } = this.props;
    const deployment = alt.stores.DeploymentsStore.getAll(cluster).first();
    const { navigator } = this.props;
    const present = Platform.OS === 'ios' ? navigator.showModal : navigator.push;
    present({ screen: 'cabin.ServicesNew', title: intl('service_new'), passProps: {
      cluster,
      deployment,
    }});
  }

  showHPANew() {
    const { navigator } = this.props;
    const present = Platform.OS === 'ios' ? navigator.showModal : navigator.push;
    present({ screen: 'cabin.HPAsNew', title: intl('hpa_new'), passProps: {
      cluster: this.props.cluster,
    }});
  }
}
