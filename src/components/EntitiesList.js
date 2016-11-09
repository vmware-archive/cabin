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
import CollectionView from 'components/commons/CollectionView';
import Colors from 'styles/Colors';
import ListItem from 'components/commons/ListItem';
import ListHeader from 'components/commons/ListHeader';
import FAB from 'components/commons/FAB';

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
    paddingBottom: 20,
  },
});

export default class EntitiesList extends Component {

  static propTypes = {
    status: PropTypes.string,
    entities: PropTypes.instanceOf(Immutable.List).isRequired,
    cluster: PropTypes.instanceOf(Immutable.Map),
    listHeader: PropTypes.string,
  }

  constructor() {
    super();
    this.state = {
      scrollEnabled: true,
    };
  }

  render() {
    const { status, entities } = this.props;
    return (
      <View style={styles.container}>
        {status === 'loading' && entities.isEmpty() ?
          <ActivityIndicator style={{flex: 1}}/> :
          <CollectionView style={styles.list}
            scrollEnabled={this.state.scrollEnabled}
            contentContainerStyle={styles.listContent}
            scrollIndicatorInsets={{bottom: 0}}
            list={entities.sortBy(e => e.getIn(['metadata', 'creationTimestamp'])).reverse()}
            onRefresh={this.refresh.bind(this)}
            renderRow={this.renderRow.bind(this)}
            renderHeader={this.props.listHeader && (() => <ListHeader title={this.props.listHeader} />)}
          />
        }
        {this.props.onCreate &&
          <FAB
            backgroundColor={this.props.actionColor || Colors.BLUE}
            onPress={this.props.onCreate}
          />
        }
      </View>
    );
  }

  renderRow(entity, rowID, index) {
    const isLast = index >= this.props.entities.size - 1;
    return (
      <ListItem
        title={entity.getIn(['metadata', 'name'])}
        entity={entity}
        showArrow={true}
        isLast={isLast}
        onSwipeStart={() => this.setState({scrollEnabled: false})}
        onSwipeEnd={() => this.setState({scrollEnabled: true})}
        onPress={() => this.onPressItem(entity)}
        onDelete={() => this.props.onDelete(entity)}
      />
    );
  }


  refresh() {
    this.props.onRefresh && this.props.onRefresh();
  }

  onPressItem(entity) {
    this.props.onPress && this.props.onPress(entity);
  }
}
