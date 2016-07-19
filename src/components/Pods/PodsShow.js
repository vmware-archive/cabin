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
import StatusView from 'components/commons/StatusView';
import LabelsView from 'components/commons/LabelsView';
import ScrollView from 'components/commons/ScrollView';
import PodsActions from 'actions/PodsActions';
import EntitiesRoutes from 'routes/EntitiesRoutes';

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

export default class PodsShow extends Component {

  static propTypes = {
    pod: PropTypes.instanceOf(Immutable.Map),
    cluster: PropTypes.instanceOf(Immutable.Map),
  }

  render() {
    const { pod } = this.props;
    let ready = 0;
    const containerStatuses = pod.getIn(['status', 'containerStatuses']).map(status => {
      if (status.get('ready')) { ready++; }
      return status;
    });
    return (
      <View style={styles.container}>
        <ScrollView style={styles.list} onRefresh={this.handleRefresh.bind(this)}>
          <View style={styles.section}>
            <ListHeader title=""/>
            <ListItem title="Name" detailTitle={pod.getIn(['metadata', 'name'])}/>
            <ListItem title="Namespace" detailTitle={pod.getIn(['metadata', 'namespace'])}/>
            <ListItem title="Status" renderDetail={() => {
              return <StatusView status={pod.get('status')}/>;
            }}/>
            <ListItem title="Ready" detailTitle={`${ready}/${containerStatuses.size}`}/>
            <ListItem title="HostIP" detailTitle={`${pod.getIn(['status', 'hostIP'])}`}/>
            <ListItem title="PodIP" detailTitle={pod.getIn(['status', 'podIP'])} />
            <ListItem title="Logs" showArrow={true} isLast={true} onPress={this.showLogs.bind(this)}/>
          </View>
          <View style={styles.section}>
            <LabelsView entity={pod} onSubmit={this.handleLabelSubmit.bind(this)} onDelete={this.handleLabelDelete.bind(this)} />
          </View>
          <View style={styles.section}>
            <ListHeader title="Containers"/>
            {this.renderContainers()}
          </View>
        </ScrollView>
      </View>
    );
  }

  renderContainers() {
    const containers = this.props.pod.getIn(['spec', 'containers']);
    const items = containers.map((container, i) => {
      return <ListItem key={i} isLast={i === containers.size - 1} title={container.get('name')} subtitle={container.get('image')}/>;
    });
    return items;
  }

  handleRefresh() {
    PodsActions.fetchPods(this.props.cluster);
  }

  handleLabelSubmit({key, value}) {
    return PodsActions.addPodLabel({pod: this.props.pod, cluster: this.props.cluster, key, value});
  }

  handleLabelDelete(key) {
    return PodsActions.deletePodLabel({pod: this.props.pod, cluster: this.props.cluster, key});
  }

  showLogs() {
    PodsActions.fetchPodLogs({pod: this.props.pod, cluster: this.props.cluster});
    this.props.navigator.push(EntitiesRoutes.getPodsLogsRoute({pod: this.props.pod, cluster: this.props.cluster}));
  }
}
