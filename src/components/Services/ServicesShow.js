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
import SegmentedControl from 'components/commons/SegmentedControl';
import ServicesActions from 'actions/ServicesActions';
import NavigationActions from 'actions/NavigationActions';
import EntitiesRoutes from 'routes/EntitiesRoutes';

const {
  View,
  StyleSheet,
  Animated,
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
    return (
      <View style={styles.container}>
        <ScrollView style={styles.list} onRefresh={this.handleRefresh.bind(this)}>
          <View style={styles.section}>
            <ListHeader title=""/>
            <ListItem title="Name" detailTitle={service.getIn(['metadata', 'name'])}/>
            <ListItem title="Namespace" detailTitle={service.getIn(['metadata', 'namespace'])}/>
            <ListItem title="Age" detailTitle={intlrd(service.getIn(['metadata', 'creationTimestamp']))}/>
            <ListItem title="Type" renderDetail={this.renderTypeDetail.bind(this)}/>
            <ListItem title="ClusterIP" detailTitle={service.getIn(['spec', 'clusterIP'])} isLast={true}/>
          </View>
          <View style={styles.section}>
            <LabelsView
              entity={service}
              onSubmit={this.handleLabelSubmit.bind(this)}
              onDelete={this.handleLabelDelete.bind(this)} />
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
          showArrow={true}
          onPress={() => this.handlePressPort(port)}
        />
      );
    });
    return items;
  }

  renderTypeDetail() {
    const controls = ['ClusterIP', 'NodePort', 'LoadBalancer'];
    const index = controls.indexOf(this.props.service.getIn(['spec', 'type']));
    return (
      <SegmentedControl
        style={{width: 280, marginRight: -10, marginTop: -5}}
        borderColor={Colors.BLUE}
        activeColor={Colors.BLUE}
        activeTextColor={Colors.WHITE}
        inactiveTextColor={Colors.BLUE}
        selectedIndex={new Animated.Value(index)}
        controls={controls}
        onPress={(i) => {
          ServicesActions.updateServiceType({cluster: this.props.cluster, service: this.props.service, type: controls[i]});
        }}
      />
    );
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

  handlePressPort(port) {
    NavigationActions.push(EntitiesRoutes.getServicesEditPortRoute({service: this.props.service, cluster: this.props.cluster, port}));
  }
}
