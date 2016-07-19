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
import ListItem from 'components/commons/ListItem';
import ListHeader from 'components/commons/ListHeader';
import LabelsView from 'components/commons/LabelsView';
import ScrollView from 'components/commons/ScrollView';
import ReplicationsSlider from 'components/Replications/ReplicationsSlider';
import ReplicationsActions from 'actions/ReplicationsActions';

const {
  View,
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
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
  },
});

export default class ReplicationsShow extends Component {

  static propTypes = {
    replication: PropTypes.instanceOf(Immutable.Map),
    cluster: PropTypes.instanceOf(Immutable.Map),
  }

  constructor(props) {
    super(props);
    this.state = {
      sliderValue: props.replication.getIn(['spec', 'replicas']),
    };
  }

  render() {
    const { replication } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.list} onRefresh={this.handleRefresh.bind(this)}>
          <View style={styles.section}>
            <ListHeader title=""/>
            <ListItem title="Name" detailTitle={replication.getIn(['metadata', 'name'])}/>
            <ListItem title="Namespace" detailTitle={replication.getIn(['metadata', 'namespace'])}/>
            <ListItem title="Age" detailTitle={intlrd(replication.getIn(['metadata', 'creationTimestamp']))} isLast={true}/>
          </View>
          <View style={styles.section}>
            <ListHeader title="Replicas"/>
            <ReplicationsSlider replication={replication} onSubmit={this.handleReplicasComplete.bind(this)}/>
            <ListItem title="Current" detailTitle={replication.getIn(['status', 'replicas'])}/>
            <ListItem title="Up to date" detailTitle={replication.getIn(['status', 'updatedReplicas'])}/>
            <ListItem title="Available" detailTitle={replication.getIn(['status', 'availableReplicas'])} isLast={true}/>
          </View>
          <View style={styles.section}>
            <LabelsView entity={replication} onSubmit={this.handleLabelSubmit.bind(this)} onDelete={this.handleLabelDelete.bind(this)} />
          </View>
        </ScrollView>
      </View>
    );
  }

  handleRefresh() {
    ReplicationsActions.fetchReplications(this.props.cluster);
  }

  handleLabelSubmit({key, value}) {
    return ReplicationsActions.addReplicationLabel({replication: this.props.replication, cluster: this.props.cluster, key, value});
  }

  handleLabelDelete(key) {
    return ReplicationsActions.deleteReplicationLabel({replication: this.props.replication, cluster: this.props.cluster, key});
  }

  handleReplicasComplete(value) {
    return ReplicationsActions.scaleReplication({replication: this.props.replication, cluster: this.props.cluster, replicas: value});
  }
}
