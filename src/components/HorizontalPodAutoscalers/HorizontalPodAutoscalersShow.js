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
import ListInputItem from 'components/commons/ListInputItem';
import ListHeader from 'components/commons/ListHeader';
import ScrollView from 'components/commons/ScrollView';
import HorizontalPodAutoscalersActions from 'actions/HorizontalPodAutoscalersActions';
import AlertUtils from 'utils/AlertUtils';

const { View, StyleSheet } = ReactNative;

const { PropTypes } = React;

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

export default class HorizontalPodAutoscalersShow extends Component {
  static propTypes = {
    hpa: PropTypes.instanceOf(Immutable.Map),
    cluster: PropTypes.instanceOf(Immutable.Map),
  };

  render() {
    const { hpa, cluster } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.containerContent}
          onRefresh={this.handleRefresh.bind(this)}
        >
          <ListHeader title="" />
          <ListItem
            title="Name"
            detailTitle={hpa.getIn(['metadata', 'name'])}
          />
          <ListItem
            title="Namespace"
            detailTitle={hpa.getIn(['metadata', 'namespace'])}
          />
          <ListItem
            title="Age"
            detailTitle={intlrd(hpa.getIn(['metadata', 'creationTimestamp']))}
          />
          <ListItem
            title="Reference"
            detailTitle={`${hpa.getIn([
              'spec',
              'scaleTargetRef',
              'kind',
            ])} / ${hpa.getIn(['spec', 'scaleTargetRef', 'name'])}`}
            isLast={true}
          />
          {hpa.getIn(['spec', 'metrics'], Immutable.List()).size > 0 &&
            <ListHeader title="Metrics" />}
          {this.renderMetrics()}
          <ListHeader title="Replicas" />
          <ListInputItem
            title="Min"
            detailInput={true}
            placeholder="Min replicas"
            defaultValue={`${hpa.getIn(['spec', 'minReplicas'], 0)}`}
            returnKeyType="done"
            keyboardType="numeric"
            onEndEditing={e => {
              const value = parseInt(e.nativeEvent.text, 10);
              const spec = { minReplicas: value };
              HorizontalPodAutoscalersActions.updateSpec({
                cluster,
                hpa,
                spec,
              }).catch(err => AlertUtils.showError({ message: err.message }));
            }}
          />
          <ListInputItem
            title="Max"
            detailInput={true}
            placeholder="Max replicas"
            defaultValue={`${hpa.getIn(['spec', 'maxReplicas'], 0)}`}
            returnKeyType="done"
            keyboardType="numeric"
            onEndEditing={e => {
              const value = parseInt(e.nativeEvent.text, 10);
              const spec = { maxReplicas: value };
              HorizontalPodAutoscalersActions.updateSpec({
                cluster,
                hpa,
                spec,
              }).catch(err => AlertUtils.showError({ message: err.message }));
            }}
          />
          <ListItem
            title="Current"
            detailTitle={`${hpa.getIn(['status', 'currentReplicas'], 0)}`}
            isLast
          />
        </ScrollView>
      </View>
    );
  }

  renderMetrics() {
    const metrics = this.props.hpa.getIn(['spec', 'metrics'], Immutable.List());
    return metrics.map((m, i) => {
      return (
        <ListItem
          key={i}
          title={m.getIn(['resource', 'name'])}
          detailTitle={`${m.getIn(
            ['resource', 'currentAverageUtilization'],
            '?'
          )} / ${m.getIn(['resource', 'targetAverageUtilization'])}%`}
          isLast={i === metrics.size - 1}
        />
      );
    });
  }

  handleRefresh() {
    HorizontalPodAutoscalersActions.fetchHorizontalPodAutoscalers(
      this.props.cluster
    );
  }
}
