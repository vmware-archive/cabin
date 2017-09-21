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
import ChartsUtils from 'utils/ChartsUtils';

import PropTypes from 'prop-types';
const {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} = ReactNative;

const styles = StyleSheet.create({
  chart: {
    width: (Dimensions.get('window').width - 20) / 2,
    height: 130,
    paddingHorizontal: 5,
    paddingBottom: 10,
  },
  chartInner: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderRadius: 5,
    padding: 10,
    borderColor: Colors.BORDER,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartIcon: {
    width: 40, height: 40,
    alignSelf: 'center',
  },
  chartTitle: {
    flex: 1,
    marginLeft: 2,
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
  chartSubtitle: {
    flex: 1,
    marginTop: 2,
    fontSize: 12,
  },
});

export default class ChartItem extends Component {

  static propTypes = {
    chart: PropTypes.instanceOf(Immutable.Map).isRequired,
  }

  render() {
    const { chart } = this.props;
    const file = chart.get('chartfile', chart);
    const titleLength = file.get('name').length;
    return (
      <View style={[styles.chart, this.props.style]}>
        <TouchableOpacity style={styles.chartInner} onPress={this.props.onPress}>
          <View style={styles.row}>
            <Image style={styles.chartIcon} source={ChartsUtils.iconForChart(file.get('name'))}/>
            <Text style={styles.chartTitle} numberOfLines={2}>{file.get('name')}</Text>
          </View>
          {titleLength < 18 && <Text style={styles.chartSubtitle} numberOfLines={3}>{file.get('description')}</Text>}
        </TouchableOpacity>
      </View>
    );
  }
}
