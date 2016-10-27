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
import ChartsUtils from 'utils/ChartsUtils';
import DeployRoutes from 'routes/DeployRoutes';

const { PropTypes } = React;
const {
  View,
  Image,
  Text,
  ActivityIndicator,
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  absolute: {
    position: 'absolute',
    left: 0, bottom: 0, right: 0, top: 0,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.BACKGROUND,
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
  releaseDetail: {
    backgroundColor: Colors.BLUE,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginTop: -4,
    height: 28,
  },
  releaseDetailText: {
    flex: 1,
    fontSize: 16,
    color: Colors.WHITE,
  },
  error: {
    color: Colors.GRAY,
    fontSize: 14,
  },
  errorTitle: {
    color: Colors.ORANGE,
    marginBottom: 6,
    fontSize: 20,
  },
});

export default class DeployReleases extends Component {

  static propTypes = {
    releases: PropTypes.instanceOf(Immutable.List).isRequired,
    cluster: PropTypes.instanceOf(Immutable.Map).isRequired,
    status: PropTypes.string,
    error: PropTypes.string,
  }

  render() {
    let view;
    switch (this.props.status) {
      case 'loading' && this.props.releases.isEmpty():
        view = this.renderLoading(); break;
      case 'failure':
        view = this.renderFailure(); break;
      default:
        view = this.renderList();
    }
    return (
      <View style={styles.container}>
        {view}
      </View>
    );
  }

  renderList() {
    return (
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
      />
    );
  }

  renderLoading() {
    return (
      <View style={styles.absolute}>
        <ActivityIndicator style={{flex: 1}} />
      </View>
    );
  }

  renderFailure() {
    const noTiller = this.props.error === 'notiller';
    return (
      <EmptyView
          image={require('images/error_circle.png')}
          imageStyle={{width: 30, height: 30, marginTop: 0, marginBottom: 0, tintColor: Colors.RED}}
          title={intl('deploy_releases_error')}
          subtitle={noTiller ? intl('deploy_no_tiller_svc_alert_subtitle') : this.props.error}
          actionTitle={noTiller ? intl('deploy_empty_action') : intl('deploy_error_action')}
          onPress={() => {
            noTiller ? NavigationActions.selectTab(1) : this.fetchReleases();
          }}
        />
    );
  }

  renderRow(release, section, index) {
    return (
      <ListItem
        renderTitle={() => {
          return (
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Image style={{width: 30, height: 30}} source={ChartsUtils.iconForChart(release.getIn(['chart', 'name']))}/>
              <Text style={{flex: 1, marginLeft: 8, fontSize: 16}} numberOfLines={1}>
                {release.get('name')}
              </Text>
            </View>
          );
        }}
        renderDetail={() => {
          return (
            <View style={styles.releaseDetail}>
              <Text style={styles.releaseDetailText} numberOfLines={1}>
                {release.getIn(['chart', 'name'])}
              </Text>
            </View>
          );
        }}
        isLast={index >= this.props.releases.size - 1}
        showArrow={true}
        onDelete={() => this.deleteRow(release)}
        onPress={() => this.showRelease(release)}
      />
    );
  }

  fetchReleases() {
    ReleasesActions.fetchReleases(this.props.cluster);
  }

  deleteRow(release) {
    ReleasesActions.deleteRelease({cluster: this.props.cluster, release});
  }

  showRelease(release) {
    this.props.navigator.push(DeployRoutes.getDeployReleasesShowRoute({cluster: this.props.cluster, release}));
  }
}
