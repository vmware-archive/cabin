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
// import ReleasesActions from 'actions/ReleasesActions';
import CollectionView from 'components/commons/CollectionView';
import ListItem from 'components/commons/ListItem';
import ClustersEmpty from 'components/Clusters/ClustersEmpty';
import Accordion from 'react-native-accordion';

const { PropTypes } = React;
const {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  listContent: {
    marginTop: 20,
    borderTopColor: Colors.BORDER,
    borderTopWidth: 1,
  },
  item: {
  },
  releasesContainer: {
    backgroundColor: Colors.BACKGROUND, // '#F6F6FB',
    borderBottomColor: Colors.BORDER,
    borderBottomWidth: 1,
  },
  releaseItem: {
    backgroundColor: 'transparent',
    marginLeft: 20,
  },
  clusterDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    width: 10,
    height: 10,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: '#c7c7cc',
    transform: [{
      rotate: '45deg',
    }],
  },
  arrowDown: {
    transform: [{
      rotate: '135deg',
    }],
  },
  clusterDetailText: {
    marginRight: 10,
  },
});

export default class DeployReleases extends Component {

  static propTypes = {
    releases: PropTypes.instanceOf(Immutable.Map).isRequired,
    clusters: PropTypes.instanceOf(Immutable.List).isRequired,
  }

  constructor() {
    super();
    this.state = {
      selectedIndex: null,
      loading: false,
    };
    this.items = [];
  }

  componentWillUpdate(nextProps) {
    if (this.state.selectedIndex === null && !Immutable.is(nextProps.releases, this.props.releases)) {
      let found = false;
      let index = 0;
      nextProps.clusters.map(cluster => {
        if (!found && nextProps.releases.get(cluster.get('url'))) {
          this.setState({selectedIndex: index});
          found = true;
        }
        index++;
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading &&
          <View style={styles.absolute}>
            <ActivityIndicator style={{flex: 1}} />
          </View>
        }
        <CollectionView style={styles.list}
          ref="CollectionView"
          scrollEnabled={this.state.scrollEnabled}
          contentInset={{bottom: 40}}
          scrollIndicatorInsets={{bottom: 0}}
          contentContainerStyle={styles.listContent}
          list={this.props.clusters}
          renderRow={this.renderRow.bind(this)}
          renderEmpty={() => <ClustersEmpty />}
        />
      </View>
    );
  }

  renderRow(cluster, section, index) {
    const clusterItem = (
      <View style={{flex: 1}}>
        <ListItem
          title={cluster.get('name')}
          isLast={true}
          renderDetail={() => this.renderClusterDetail(cluster, index)}
          onPress={() => this.selectRow(index)}
        />
      </View>
    );
    const releases = (
      <View style={styles.releasesContainer}>
        {this.renderReleases(cluster)}
      </View>
    );
    return (
      <Accordion
        ref={e => {this.items[index] = e;}}
        header={clusterItem}
        content={releases}
        easing="easeOutCubic"
      />
    );
  }

  renderClusterDetail(cluster, index) {
    const releases = this.props.releases.get(cluster.get('url'));
    const text = releases && releases.size > 0 ? releases.size : 'No releases';
    const selected = this.state.selectedIndex === index;
    return (
      <View style={styles.clusterDetail}>
        <Text style={styles.clusterDetailText}>{text}</Text>
        <View style={[styles.arrow, selected && styles.arrowDown]}/>
      </View>
    );
  }

  renderReleases(cluster) {
    const releases = this.props.releases.get(cluster.get('url'));
    if (!releases || releases.size === 0) {
      return <Text>{'No releases'}</Text>;
    }
    return releases.map((release, i) => {
      return (
        <ListItem style={styles.releaseItem}
          hideSeparator={i >= releases.size - 1}
          title={release.get('name')}
          onDelete={() => {}}
          />
      );
    });
  }

  selectRow(nextIndex) {
    const previousIndex = this.state.selectedIndex;
    if (previousIndex !== nextIndex) {
      this.setState({selectedIndex: nextIndex});
      this.items[nextIndex] && this.items[nextIndex].open();
      this.items[previousIndex] && this.items[previousIndex].close();
    } else {
      if (previousIndex !== null) { this.setState({selectedIndex: null}); }
      this.items[nextIndex] && this.items[nextIndex].toggle();
    }
  }

  fetchReleases() {
    // ReleasesActions.fetchReleases()
    // .then(() => this.setState({loading: false}))
    // .catch(() => this.setState({loading: false}));
  }

}
