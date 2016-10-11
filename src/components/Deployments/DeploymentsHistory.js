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
import CollectionView from 'components/commons/CollectionView';
import ListItem from 'components/commons/ListItem';
import ListHeader from 'components/commons/ListHeader';
import DeploymentsActions from 'actions/DeploymentsActions';
import AlertUtils from 'utils/AlertUtils';

const {
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
} = ReactNative;

const { PropTypes } = React;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  list: {
    flex: 1,
  },
  listContent: {
    marginTop: 20,
  },
});

export default class DeploymentsHistory extends Component {

  static propTypes = {
    deployment: PropTypes.instanceOf(Immutable.Map),
    cluster: PropTypes.instanceOf(Immutable.Map),
    replicas: PropTypes.instanceOf(Immutable.List),
  }

  render() {
    const { replicas } = this.props;
    return (
      <View style={styles.container}>
        {replicas.isEmpty() ?
          <ActivityIndicator style={{flex: 1}}/> :
          <CollectionView style={styles.list}
            contentContainerStyle={styles.listContent}
            contentInset={{bottom: 40}}
            scrollIndicatorInsets={{bottom: 0}}
            list={replicas.sortBy(e => e.getIn(['metadata', 'annotations', 'deployment.kubernetes.io/revision']))}
            onRefresh={this.refresh.bind(this)}
            renderRow={this.renderRow.bind(this)}
            renderHeader={() => <ListHeader title={intl('revisions')} />}
          />
        }
      </View>
    );
  }

  renderRow(replica, rowID, index) {
    const isLast = index >= this.props.replicas.size - 1;
    return (
      <ListItem
        subtitle={intl('deployment_change_cause') + replica.getIn(['metadata', 'annotations', 'kubernetes.io/change-cause'], intl('none'))}
        title={replica.getIn(['metadata', 'annotations', 'deployment.kubernetes.io/revision'])}
        showArrow={true}
        onPress={() => this.onPressItem(replica)}
        onDelete={() => this.rollbackTo(replica)}
        deleteTitle={intl('deployment_rollback')}
        isLast={isLast}
      />
    );
  }

  refresh() {
    const { deployment, cluster } = this.props;
    DeploymentsActions.fetchHistory({cluster, deployment});
  }

  onPressItem(replica) {
    const revision = replica.getIn(['metadata', 'annotations', 'deployment.kubernetes.io/revision']);
    Alert.alert(null, intl('deployment_rollback_alert', {revision}),
      [
        {text: intl('cancel')},
        {text: intl('deployment_rollback_action'), onPress: () => this.rollbackTo(replica)},
      ]
    );
  }

  rollbackTo(replica) {
    const { deployment, cluster } = this.props;
    const revision = replica.getIn(['metadata', 'annotations', 'deployment.kubernetes.io/revision']);
    DeploymentsActions.rollbackToRevision({cluster, deployment, revision}).then(r => {
      console.log(r.toJS());
      AlertUtils.showSuccess({message: intl('deployment_rollback_succeed')});
    });
  }

}
