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
import DraggableItem from 'components/commons/DraggableItem';
import SortableListView from 'react-native-sortable-listview';
import SettingsActions from 'actions/SettingsActions';

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
    paddingTop: 20,
  },
});

export default class Settings extends Component {

  constructor() {
    super();
    this.state = {
      scrollEnabled: true,
      order: alt.stores.SettingsStore.getEntitiesOrder(),
    };
  }

  render() {
    const entities = alt.stores.SettingsStore.getEntities();
    return (
      <View style={styles.container}>
          <SortableListView
            style={styles.list}
            scrollEnabled={this.state.scrollEnabled}
            data={entities.toObject()}
            order={this.state.order.toJS()}
            renderRow={this.renderRow.bind(this)}
            onRowMoved={this.handleRowMoved.bind(this)}
            onMoveEnd={() => {
              this.setState({scrollEnabled: true});
            }}
          />
      </View>
    );
  }

  renderRow(entity, section, row) {
    return (
      <DraggableItem
        style={entity.get('hidden') && {opacity: 0.4}}
        title={_.capitalize(entity.get('name'))}
        detailTitle={entity.get('hidden') && 'Hidden'}
        onDragStart={() => this.setState({scrollEnabled: false})}
        onPress={() => this.handleOnPress({entity, key: row})}
      />
    );
  }

  handleRowMoved(e) {
    if (e.to !== e.from) {
      const { order } = this.state;
      const newOrder = order.delete(e.from).insert(e.to, order.get(e.from));
      this.setState({order: newOrder});
      SettingsActions.updateEntitiesOrder(newOrder);
    }
  }

  handleOnPress({entity, key}) {
    if (entity.get('hidden') || alt.stores.SettingsStore.getEntitiesToDisplay().size > 1) {
      SettingsActions.setEntityHidden({key, hidden: !entity.get('hidden')});
    }
  }
}
