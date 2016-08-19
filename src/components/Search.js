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
import ClustersActions from 'actions/ClustersActions';
import SearchActions from 'actions/SearchActions';
import SearchEntitiesStore from 'stores/SearchEntitiesStore';
import EntitiesRoutes from 'routes/EntitiesRoutes';
import ListItem from 'components/commons/ListItem';
import ListHeader from 'components/commons/ListHeader';
import ScrollView from 'components/commons/ScrollView';

const { PropTypes } = React;
const {
  View,
  StyleSheet,
  DeviceEventEmitter,
} = ReactNative;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 20,
  },
});

export default class Search extends Component {

  static propTypes = {
    cluster: PropTypes.instanceOf(Immutable.Map).isRequired,
    entities: PropTypes.instanceOf(Immutable.Map),
  }

  static defaultProps = {
    entities: Immutable.fromJS({
      pods: [], services: [], replications: [],
    }),
  }

  constructor() {
    super();
    this.query = '';
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.searchListener = DeviceEventEmitter.addListener('search:change', this.handleSearch.bind(this));
    SearchEntitiesStore.listen(this.onChange);
    this.refresh();
    SearchActions.searchEntities({cluster: this.props.cluster, query: this.query});
  }

  componentWillUnmount() {
    this.searchListener.remove();
    SearchEntitiesStore.unlisten(this.onChange);
  }

  render() {
    const result = SearchEntitiesStore.getResult({cluster: this.props.cluster, query: this.query});
    const renderItems = (e, i, list) => this.renderItem(e, i, list);
    const items = result.map((list, entityType) => {
      if (list.size <= 0) { return false; }
      return (
        <View key={entityType}>
          <ListHeader key={entityType} title={intl(entityType)}/>
          {list.map(renderItems)}
        </View>
      );
    });
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps={true}
          onRefresh={this.refresh.bind(this)}>
          {items}
        </ScrollView>
      </View>
    );
  }

  renderItem(entity, index, list) {
    const isLast = index >= list.size - 1;
    return (
      <ListItem
        key={index}
        entity={entity}
        title={entity.getIn(['metadata', 'name'])}
        showArrow={true}
        isLast={isLast}
        onPress={() => this.handlePress(entity)}
      />
    );
  }

  onChange() {
    this.forceUpdate();
  }

  refresh() {
    ClustersActions.fetchClusterEntities(this.props.cluster);
  }

  handlePress(entity) {
    this.props.navigator.push(EntitiesRoutes.getEntitiesShowRoute(entity));
  }

  handleSearch({text}) {
    this.query = text;
    SearchActions.searchEntities({cluster: this.props.cluster, query: text});
  }
}
