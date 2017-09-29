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
import AltContainer from 'alt-container';
import Colors from 'styles/Colors';
import DraggableItem from 'components/commons/DraggableItem';
import EntityIcon from 'components/commons/EntityIcon';
import SortableListView from 'react-native-sortable-listview';
import SettingsActions from 'actions/SettingsActions';
import ClustersActions from 'actions/ClustersActions';

const {
  View,
  Text,
  Switch,
  Image,
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
  contentContainer: {
    paddingBottom: 20,
  },
  orderIcon: {
    width: 15, height: 15,
    tintColor: Colors.GRAY,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export class SettingsEntitiesContainer extends Component {

  render() {
    return (
      <AltContainer stores={{
        entities: () => {
          return {
            store: alt.stores.SettingsStore,
            value: alt.stores.SettingsStore.getEntities(),
          };
        }}}>
        <SettingsEntities entities={alt.stores.SettingsStore.getEntities()}/>
      </AltContainer>
    );
  }
}

export default class SettingsEntities extends Component {

  constructor() {
    super();
    this.state = {
      scrollEnabled: true,
      order: alt.stores.SettingsStore.getEntitiesOrder(),
    };
  }

  render() {
    const {entities} = this.props;
    return (
      <View style={styles.container}>
          <SortableListView
            style={styles.list}
            contentContainerStyle={styles.contentContainer}
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
    const isLast = row === this.state.order.last();
    return (
      <DraggableItem
        style={[{height: 50}, entity.get('hidden') && {backgroundColor: Colors.BACKGROUND}]}
        renderTitle={() => {
          return (
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <EntityIcon type={entity.get('name')} />
              <Text style={styles.title}>{intl(entity.get('name'))}</Text>
            </View>
          );
        }}
        renderDetail={() => {
          return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Switch value={!entity.get('hidden')} onValueChange={() => this.handleOnPress({entity, key: row})} style={styles.switch}/>
              <Image source={require('images/list.png')} style={styles.orderIcon} />
            </View>
          );
        }}
        isLast={isLast}
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
      setTimeout(() => {
        if (entity.get('hidden')) {
          ClustersActions.fetchAllClustersEntities.defer();
        }
      }, 1000);
    }
  }
}
