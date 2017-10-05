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
import Colors, { defaultNavigatorStyle } from 'styles/Colors';
import ListItem from 'components/commons/ListItem';
import ListHeader from 'components/commons/ListHeader';
import LabelsView from 'components/commons/LabelsView';
import ScrollView from 'components/commons/ScrollView';
import SegmentedControl from 'components/commons/SegmentedControl';
import ServicesActions from 'actions/ServicesActions';
import NodesActions from 'actions/NodesActions';
import ActionSheetUtils from 'utils/ActionSheetUtils';
import AlertUtils from 'utils/AlertUtils';
import ClustersUtils from 'utils/ClustersUtils';
import Linking from 'utils/Linking';
import AltContainer from 'alt-container';

const {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} = ReactNative;

import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  list: {
    flex: 1,
  },
  containerContent: {
    paddingBottom: 20,
  },
});

export class ServicesShowContainer extends Component {

  static navigatorStyle = defaultNavigatorStyle;

  static navigatorButtons = {
    rightButtons: [{
      id: 'yaml',
      icon: require('images/view.png'),
    }],
  };

  render() {
    const { service, cluster, navigator } = this.props;
    return (
      <AltContainer
        stores={{
          service: () => {
            return {
              store: alt.stores.ServicesStore,
              value: alt.stores.ServicesStore.get({
                entity: service,
                cluster,
              }),
            };
          },
        }}
      >
        <ServicesShow
          service={service}
          cluster={cluster}
          navigator={navigator}
        />
      </AltContainer>
    );
  }
}

export default class ServicesShow extends Component {

  static propTypes = {
    service: PropTypes.instanceOf(Immutable.Map),
    cluster: PropTypes.instanceOf(Immutable.Map),
  }

  componentDidMount() {
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress' && event.id === 'yaml') {
      this.props.navigator.push({
        screen: 'cabin.EntitiesYaml',
        passProps: { cluster: this.props.cluster, entity: this.props.service },
      });
    }
  }

  render() {
    const { service } = this.props;
    const smallDevice = Dimensions.get('window').width <= 340;
    let externalIP = null;
    if (service.getIn(['spec', 'type']) === 'LoadBalancer' && service.getIn(['status', 'loadBalancer', 'ingress'], Immutable.List()).size > 0) {
      externalIP = service.getIn(['status', 'loadBalancer', 'ingress', 0, 'ip']);
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.list} contentContainerStyle={styles.containerContent} onRefresh={this.handleRefresh.bind(this)}>
          <ListHeader title=""/>
          <ListItem title="Name" detailTitle={service.getIn(['metadata', 'name'])}/>
          <ListItem title="Namespace" detailTitle={service.getIn(['metadata', 'namespace'])}/>
          <ListItem title="Age" detailTitle={intlrd(service.getIn(['metadata', 'creationTimestamp']))}/>
          <ListItem title={!smallDevice && 'Type'} renderDetail={this.renderTypeDetail.bind(this)}/>
          <ListItem title="ClusterIP" detailTitle={service.getIn(['spec', 'clusterIP'])} isLast={!externalIP}/>
          {externalIP && <ListItem title="ExternalIP" detailTitle={externalIP} isLast={true}/>}
          <LabelsView
            entity={service}
            onSubmit={this.handleLabelSubmit.bind(this)}
            onDelete={this.handleLabelDelete.bind(this)} />
          <ListHeader title="Ports"/>
          {this.renderPorts()}
        </ScrollView>
      </View>
    );
  }

  renderPorts() {
    const { service } = this.props;
    const ports = service.getIn(['spec', 'ports']);
    const items = ports.map((port, i) => {
      const title = port.get('name') ? `${port.get('name')}` : '';
      let subtitle = `Port: ${port.get('port')} - Target: ${port.get('targetPort')}`;
      if (service.getIn(['spec', 'type']) === 'NodePort') {
        subtitle += ` - NodePort: ${port.get('nodePort')}`;
      }
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
        style={{alignSelf: 'center', width: 280, marginRight: -10}}
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
    const { service } = this.props;
    if (service.getIn(['spec', 'type']) === 'NodePort' || (service.getIn(['spec', 'type']) === 'LoadBalancer' && service.getIn(['status', 'loadBalancer', 'ingress'], Immutable.List()).size > 0)) {
      const options = [
        {title: intl('cancel')},
        {title: intl('edit'), onPress: () => this.handleEdit(port)},
        {title: intl('open_in_browser'), onPress: () => this.handleOpenPort(port)},
      ];
      ActionSheetUtils.showActionSheetWithOptions({options});
      return;
    }
    this.handleEdit(port);
  }

  handleEdit(port) {
    this.props.navigator.push({ screen: 'cabin.ServicesEditPort', title: 'Edit Port', passProps: {service: this.props.service, cluster: this.props.cluster, port} });
  }

  handleOpenPort(port) {
    const { service, cluster } = this.props;
    if (service.getIn(['spec', 'type']) === 'NodePort') {
      if (!this.openServiceWithPort({port})) {
        NodesActions.fetchNodes(cluster).then(() => {
          const succeed = this.openServiceWithPort({port});
          if (!succeed) {
            AlertUtils.showError({message: intl('service_open_browser_no_node')});
          }
        });
      }
    } else if (service.getIn(['spec', 'type']) === 'LoadBalancer' && service.getIn(['status', 'loadBalancer', 'ingress'], Immutable.List()).size > 0) {
      const ip = service.getIn(['status', 'loadBalancer', 'ingress', 0, 'ip']);
      Linking.openURL(`http://${ip}:${port.get('targetPort')}`);
    }
  }

  openServiceWithPort({port}) {
    const url = ClustersUtils.nodeUrlForCluster(this.props.cluster);
    if (!url) { return false; }
    Linking.openURL(`http://${url}:${port.get('nodePort')}`);
    return true;
  }
}
