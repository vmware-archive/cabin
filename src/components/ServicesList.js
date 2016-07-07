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
import PodsRoutes from 'routes/PodsRoutes';
import CollectionView from 'components/commons/CollectionView';
import Colors from 'styles/Colors';
import ListItem from 'components/commons/ListItem';
import PodsActions from 'actions/PodsActions';
import ListHeader from 'components/commons/ListHeader';

const {
  View,
  StyleSheet,
  ActivityIndicator,
} = ReactNative;

const { PropTypes } = React;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  list: {
    flex: 1,
  },
  listContent: {
    marginTop: 40,
    borderColor: Colors.BORDER,
    borderBottomWidth: 1,
  },
});

export default class ServicesList extends Component {

  static propTypes = {
    status: PropTypes.string,
    services: PropTypes.instanceOf(Immutable.List).isRequired,
    cluster: PropTypes.instanceOf(Immutable.Map),
  }

  render() {
    const { status, services } = this.props;
    return (
      <View style={styles.container}>
        {status === 'loading' ?
          <ActivityIndicator style={{flex: 1}}/> :
          <CollectionView style={styles.list}
            contentContainerStyle={styles.listContent}
            contentInset={{bottom: 40}}
            scrollIndicatorInsets={{bottom: 0}}
            list={services}
            onRefresh={this.refresh.bind(this)}
            renderRow={this.renderRow.bind(this)}
            renderHeader={() => <ListHeader title="Pods" />}
          />
        }
      </View>
    );
  }

  renderRow(pod, rowID, index) {
    const showSeparator = index < this.props.pods.size - 1;
    return (
      <ListItem
        title={pod.getIn(['metadata', 'name'])}
        showArrow={true}
        showSeparator={showSeparator}
        onPress={() => this.onPressItem(pod)}
      />
    );
  }


  refresh() {
    this.props.cluster && PodsActions.fetchPods(this.props.cluster);
  }

  onPressItem(pod) {
    this.props.navigator.push(PodsRoutes.getPodsShowRoute(pod));
  }
}
