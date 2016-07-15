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
import ServicesActions from 'actions/ServicesActions';

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

export default class ServicesShow extends Component {

  static propTypes = {
    service: PropTypes.instanceOf(Immutable.Map),
    cluster: PropTypes.instanceOf(Immutable.Map),
  }

  render() {
    const { service } = this.props;
    console.log('SERVICE', service.toJS());
    return (
      <View style={styles.container}>
        <ScrollView style={styles.list} onRefresh={this.handleRefresh.bind(this)}>
          <View style={styles.section}>
            <ListHeader title=""/>
            <ListItem title="Name" detailTitle={service.getIn(['metadata', 'name'])}/>
            <ListItem title="Age" detailTitle={intlrd(service.getIn(['metadata', 'creationTimestamp']))}/>
            <ListItem title="Type" detailTitle={service.getIn(['spec', 'type'])}/>
            <ListItem title="ClusterIP" detailTitle={service.getIn(['spec', 'clusterIP'])} isLast={true}/>
          </View>
          <View style={styles.section}>
            <LabelsView entity={service} onSubmit={this.handleLabelSubmit.bind(this)} onDelete={this.handleLabelDelete.bind(this)} />
          </View>
          <View style={styles.section}>
            <ListHeader title="Ports"/>
            {this.renderPorts()}
          </View>
        </ScrollView>
      </View>
    );
  }

  renderPorts() {
    const ports = this.props.service.getIn(['spec', 'ports']);
    const items = ports.map((port, i) => {
      const title = port.get('name') ? `${port.get('name')}` : '';
      const subtitle = `Port: ${port.get('port')} - Target: ${port.get('targetPort')}`;
      return (
        <ListItem
          key={i} isLast={i === ports.size - 1}
          title={title ? title : subtitle}
          subtitle={title ? subtitle : null}
          detailTitle={port.get('protocol')}
        />
      );
    });
    return items;
  }

  handleRefresh() {
    ServicesActions.fetchServices(this.props.cluster);
  }

  handleLabelSubmit({key, value}) {
    return ServicesActions.addServiceLabel({service: this.props.service, cluster: this.props.cluster, key, value});
  }

  handleLabelDelete(key) {
    return ServicesActions.deleteServiceLabel({service: this.props.service, cluster: this.props.cluster, key});
  }
}
