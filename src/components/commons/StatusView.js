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
import ClustersUtils from 'utils/ClustersUtils';

const {
  View,
  Text,
  StyleSheet,
} = ReactNative;

const { PropTypes } = React;

const styles = StyleSheet.create({
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
});

export default class StatusView extends Component {

  static propTypes = {
    status: PropTypes.string.isRequired,
  }

  render() {
    let { status } = this.props;
    if (typeof status === 'object' && status.get('phase')) {
      status = status.get('phase').toUpperCase();
    }
    if (typeof status !== 'string') { return false; }
    return (
      <View style={[styles.status, this.props.style]}>
        <Text style={styles.statusText}>{ClustersUtils.textForStatus(status)}</Text>
        <View style={[styles.dot, {backgroundColor: ClustersUtils.colorForStatus(status)}]} />
      </View>
    );
  }

}
