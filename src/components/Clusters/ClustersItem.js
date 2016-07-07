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
import Colors from 'styles/Colors';
import AltContainer from 'alt-container';
import ClustersUtils from 'utils/ClustersUtils';

const {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 4,
    marginHorizontal: 8,
    marginVertical: 8,
    borderColor: Colors.BORDER,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    borderColor: Colors.BORDER,
    borderBottomWidth: 1,
    padding: 8,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: Colors.GRAY,
  },
  dot: {
    width: 10, height: 10,
    borderRadius: 5,
    marginLeft: 6,
  },
  stats: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    color: Colors.GRAY,
    textAlign: 'center',
  },
});

class Counter extends Component {
  render() {
    return <Text style={styles.statItem}>{this.props.value}</Text>;
  }
}

export default class ClusterItem extends Component {

  static propTypes = {
    cluster: PropTypes.instanceOf(Immutable.Map).isRequired,
  }

  render() {
    const { cluster } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.innerContainer} onPress={this.props.onPress} onLongPress={this.props.onLongPress}>
          <View style={styles.header}>
            <Text style={styles.title}>{cluster.get('name')}</Text>
            <View style={styles.status}>
              <Text style={styles.statusText}>{ClustersUtils.textForStatus(cluster.get('status'))}</Text>
              <View style={[styles.dot, {backgroundColor: ClustersUtils.colorForStatus(cluster.get('status'))}]} />
            </View>
          </View>
          <View style={styles.stats}>
            <AltContainer stores={{
              value: () => {
                return {
                  store: alt.stores.PodsStore,
                  value: alt.stores.PodsStore.getPods(cluster).size + ' Pods',
                };
              }}}>
              <Counter value=".. Pods"/>
            </AltContainer>
            <AltContainer stores={{
              value: () => {
                return {
                  store: alt.stores.ServicesStore,
                  value: alt.stores.ServicesStore.getServices(cluster).size + ' Services',
                };
              }}}>
              <Counter value=".. Services"/>
            </AltContainer>
            <AltContainer stores={{
              value: () => {
                return {
                  store: alt.stores.ReplicationsStore,
                  value: alt.stores.ReplicationsStore.getReplications(cluster).size + ' Replications',
                };
              }}}>
              <Counter value=".. Replications"/>
            </AltContainer>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

}
