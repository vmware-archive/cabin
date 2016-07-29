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

const { PropTypes } = React;
const {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} = ReactNative;

const styles = StyleSheet.create({
  chart: {
    width: Dimensions.get('window').width / 2,
    paddingHorizontal: 10,
  },
  chartInner: {
    backgroundColor: Colors.WHITE,
    borderRadius: 5,
    padding: 10,
    borderColor: Colors.BORDER,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  chartIcon: {
    width: 30, height: 30,
    tintColor: Colors.BLUE,
    alignSelf: 'center',
  },
  chartTitle: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: '600',
  },
  chartSubtitle: {
    fontSize: 12,
  },
});

export default class ChartItem extends Component {

  static propTypes = {
    chart: PropTypes.instanceOf(Immutable.Map).isRequired,
  }

  render() {
    const { chart } = this.props;
    const file = chart.get('chartfile');
    return (
      <View style={styles.chart}>
        <View style={styles.chartInner}>
          <Image style={styles.chartIcon} source={require('images/kubernetes.png')}/>
          <Text style={styles.chartTitle}>{file.get('name')}</Text>
          <Text style={styles.chartSubtitle}>{file.get('description')}</Text>
        </View>
      </View>
    );
  }
}
