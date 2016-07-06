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
import { PropTypes } from 'react';
import EntitiesList from 'components/EntitiesList';
import NodesRoutes from 'routes/NodesRoutes';
import NodesActions from 'actions/NodesActions';
import ServicesActions from 'actions/ServicesActions';
import ReplicationsActions from 'actions/ReplicationsActions';
import AltContainer from 'alt-container';
import Colors from 'styles/Colors';
import SegmentedControl from 'components/commons/SegmentedControl';

const {
  View,
  Animated,
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingVertical: 10,
    backgroundColor: Colors.BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.BORDER,
    borderBottomWidth: 1,
  },
  endpointStatus: {
    width: 40, height: 40,
    backgroundColor: Colors.GREEN,
  },
});

export default class EndpointShow extends Component {

  static propTypes = {
    endpoint: PropTypes.instanceOf(Immutable.Map).isRequired,
  }

  constructor() {
    super();
    this.state = {
      animatedIndex: new Animated.Value(0),
      activePage: 0,
    };
  }

  render() {
    const { endpoint } = this.props;
    const controls = ['Pods', 'Services', 'Replications'];
    return (
      <View style={styles.flex}>
        <View style={styles.header}>
          <SegmentedControl
            style={{flex: 1, marginHorizontal: 8}}
            selectedIndex={this.state.animatedIndex}
            controls={controls}
            onPress={(i) => {
              this.state.animatedIndex.setValue(i);
              this.setState({activePage: i});
            }}
          />
        </View>
        {this.state.activePage === 0 && <AltContainer stores={{
          entities: () => {
            return {
              store: alt.stores.NodesStore,
              value: alt.stores.NodesStore.getNodes(endpoint),
            };
          },
          status: () => {
            return {
              store: alt.stores.NodesStore,
              value: alt.stores.NodesStore.getStatus(endpoint),
            };
          }}}>
          <EntitiesList
            navigator={this.props.navigator}
            listHeader="Nodes"
            status={alt.stores.NodesStore.getStatus(endpoint)}
            entities={alt.stores.NodesStore.getNodes(endpoint)}
            onPress={(node) => this.props.navigator.push(NodesRoutes.getNodesShowRoute(node))}
            onRefresh={() => NodesActions.fetchNodes(endpoint)}
          />
        </AltContainer>}

        {this.state.activePage === 1 && <AltContainer stores={{
          entities: () => {
            return {
              store: alt.stores.ServicesStore,
              value: alt.stores.ServicesStore.getServices(endpoint),
            };
          },
          status: () => {
            return {
              store: alt.stores.ServicesStore,
              value: alt.stores.ServicesStore.getStatus(endpoint),
            };
          }}}>
          <EntitiesList
            navigator={this.props.navigator}
            listHeader="Services"
            status={alt.stores.ServicesStore.getStatus(endpoint)}
            entities={alt.stores.ServicesStore.getServices(endpoint)}
            onRefresh={() => ServicesActions.fetchServices(endpoint)}
          />
        </AltContainer>}

        {this.state.activePage === 2 && <AltContainer stores={{
          entities: () => {
            return {
              store: alt.stores.ReplicationsStore,
              value: alt.stores.ReplicationsStore.getReplications(endpoint),
            };
          },
          status: () => {
            return {
              store: alt.stores.ReplicationsStore,
              value: alt.stores.ReplicationsStore.getStatus(endpoint),
            };
          }}}>
          <EntitiesList
            navigator={this.props.navigator}
            listHeader="Replication Controllers"
            status={alt.stores.ReplicationsStore.getStatus(endpoint)}
            entities={alt.stores.ReplicationsStore.getReplications(endpoint)}
            onRefresh={() => ReplicationsActions.fetchReplications(endpoint)}
          />
        </AltContainer>}
      </View>
    );
  }

}
