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
import ReleasesActions from 'actions/ReleasesActions';
import CollectionView from 'components/commons/CollectionView';
import ListItem from 'components/commons/ListItem';
import EmptyView from 'components/commons/EmptyView';
import NavigationActions from 'actions/NavigationActions';

const { PropTypes } = React;
const {
  View,
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
    releases: PropTypes.instanceOf(Immutable.List).isRequired,
    cluster: PropTypes.instanceOf(Immutable.Map).isRequired,
    status: PropTypes.string,
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.status === 'loading' ?
          <View style={styles.absolute}>
            <ActivityIndicator style={{flex: 1}} />
          </View>
        :
        <CollectionView style={styles.list}
          ref="CollectionView"
          contentInset={{bottom: 40}}
          scrollIndicatorInsets={{bottom: 0}}
          contentContainerStyle={styles.listContent}
          list={this.props.releases}
          onRefresh={this.fetchReleases.bind(this)}
          renderRow={this.renderRow.bind(this)}
          renderEmpty={() => <EmptyView
              image={require('images/cubes.png')}
              title={intl('deploy_empty_title')}
              subtitle={intl('deploy_empty_subtitle')}
              actionTitle={intl('deploy_empty_action')}
              onPress={() => NavigationActions.selectTab(1)}
            />}
        />}
      </View>
    );
  }

  renderRow(release, section, index) {
    return (
      <ListItem
        title={release.get('name')}
        isLast={index === this.props.releases.size - 1}
        onDelete={() => this.deleteRow(release)}
      />
    );
  }

  fetchReleases() {
    ReleasesActions.fetchReleases(this.props.cluster);
  }

  deleteRow(release) {
    console.log('delete ', release.toJS());
  }
}
