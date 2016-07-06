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
import Nodes from 'components/Nodes';
import AltContainer from 'alt-container';
import Colors from 'styles/Colors';

const {
  View,
  Text,
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    height: 30,
    paddingBottom: 15,
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

  render() {
    const { endpoint } = this.props;
    return (
      <View style={styles.flex}>
        <View style={styles.header}>
            <Text style={{color: Colors.WHITE}}>{endpoint.get('url')}</Text>
        </View>
        <AltContainer stores={{
          nodes: () => {
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
          <Nodes
            navigator={this.props.navigator}
            status={alt.stores.NodesStore.getStatus(endpoint)}
            nodes={alt.stores.NodesStore.getNodes(endpoint)}
          />
        </AltContainer>
      </View>
    );
  }

}
