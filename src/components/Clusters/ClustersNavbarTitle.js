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
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import Colors from 'styles/Colors';
import ClustersUtils from 'utils/ClustersUtils';
import PStyleSheet from 'styles/PStyleSheet';

const { View, Text } = ReactNative;

const styles = PStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    ios: {
      justifyContent: 'center',
    },
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    ios: {
      marginRight: 6,
    },
    android: {
      marginRight: 10,
    },
  },
  text: {
    color: Colors.WHITE,
    fontSize: 17,
    fontWeight: '600',
  },
});

export class ClustersNavbarTitleContainer extends Component {

  render() {
    return (
      <AltContainer stores={{
        cluster: () => {
          return {
            store: alt.stores.ClustersStore,
            value: alt.stores.ClustersStore.get(this.props.clusterUrl),
          };
        }}}>
        <ClustersNavbarTitle cluster={alt.stores.ClustersStore.get(this.props.clusterUrl)}/>
      </AltContainer>
    );
  }
}

export default class ClustersNavbarTitle extends Component {
  static propTypes = {
    cluster: PropTypes.instanceOf(Immutable.Map).isRequired,
  };

  render() {
    const { cluster } = this.props;
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: ClustersUtils.colorForStatus(
                cluster ? cluster.get('status') : ''
              ),
            },
          ]}
        />
        <Text style={styles.text}>{cluster ? cluster.get('name') : '-'}</Text>
      </View>
    );
  }
}
