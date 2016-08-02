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
import ChartsActions from 'actions/ChartsActions';
import SettingsActions from 'actions/SettingsActions';
import DeployRoutes from 'routes/DeployRoutes';
import ScrollView from 'components/commons/ScrollView';
import HeaderPicker from 'components/commons/HeaderPicker';
import ChartItem from './ChartItem';
import AltContainer from 'alt-container';

const { PropTypes } = React;
const {
  View,
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  list: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
});

export default class DeployIndex extends Component {

  static propTypes = {
    charts: PropTypes.instanceOf(Immutable.Map).isRequired,
  }

  componentDidMount() {
    ChartsActions.fetchCharts.defer();
  }

  render() {
    const charts = this.props.charts.map((chart, key) => {
      return <ChartItem key={key} chart={chart} onPress={() => this.handleSelectChart(chart)} />;
    }).toArray();
    return (
      <View style={styles.container}>
      <AltContainer stores={{
        choices: () => {
          return {
            store: alt.stores.SettingsStore,
            value: alt.stores.SettingsStore.getChartsStores().map(s => s.get('name')),
          };
        },
        selectedIndex: () => {
          return {
            store: alt.stores.SettingsStore,
            value: alt.stores.SettingsStore.getSelectedChartsStoreIndex(),
          };
        }}}>
          <HeaderPicker
            choices={alt.stores.SettingsStore.getChartsStores().map(s => s.get('name'))}
            selectedIndex={alt.stores.SettingsStore.getSelectedChartsStoreIndex()}
            onChange={(index) => {
              SettingsActions.updateSelectedChartsStoreIndex(index);
              ChartsActions.fetchCharts();
            }}/>
        </AltContainer>
        <ScrollView style={styles.list} contentContainerStyle={styles.content} onRefresh={() => ChartsActions.fetchCharts()}>
          {charts}
        </ScrollView>
      </View>
    );
  }

  handleSelectChart(chart) {
    this.props.navigator.push(DeployRoutes.getDeployClustersRoute(chart));
  }
}
