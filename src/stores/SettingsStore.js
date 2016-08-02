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
import alt from 'src/alt';
import SettingsActions from 'actions/SettingsActions';
import InitActions from 'actions/InitActions';
import Immutable from 'immutable';
import immutableUtil from 'alt-utils/lib/ImmutableUtil';
import { AsyncStorage } from 'react-native';

class SettingsStore {

  constructor() {
    this.bindActions(SettingsActions);
    this.bindActions(InitActions);
    this.state = Immutable.fromJS({
      maxReplicas: 40,
      chartsStores: [
        { url: 'http://storage.googleapis.com/kubernetes-charts/index.yaml', name: 'Default store' },
      ],
      selectedChartsStoreIndex: 0,
      entitiesDisplay: {
        order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        entities: {
          0: {name: 'pods'},
          1: {name: 'services'},
          2: {name: 'replicationcontrollers'},
          3: {name: 'nodes'},
          4: {name: 'deployments', hidden: true},
          5: {name: 'secrets', hidden: true},
          6: {name: 'serviceaccounts', hidden: true},
          7: {name: 'persistentvolumes', hidden: true},
          8: {name: 'persistentvolumeclaims', hidden: true},
          9: {name: 'ingresses', hidden: true},
        },
      },
    });
  }

  onInitAppSuccess(appState) {
    if (appState.get(this.displayName)) {
      // /** Remove this before release
      let state = this.state.merge(appState.get(this.displayName));
      if (state.getIn(['entitiesDisplay', 'order']).size < this.state.getIn(['entitiesDisplay', 'order']).size) {
        state = state.setIn(['entitiesDisplay', 'order'], this.state.getIn(['entitiesDisplay', 'order']))
          .setIn(['entitiesDisplay', 'entities'], this.state.getIn(['entitiesDisplay', 'entities']));
      }
      // **/
      this.setState(state);
      return true;
    }
    return false;
  }

  onUpdateEntitiesOrder(order) {
    this.setState(this.state.setIn(['entitiesDisplay', 'order'], order));
    this.saveStore();
  }

  onSetEntityHidden({key, hidden}) {
    this.setState(this.state.setIn(['entitiesDisplay', 'entities', `${key}`, 'hidden'], hidden));
    this.saveStore();
  }

  onUpdateMaxReplicas(value) {
    this.setState(this.state.set('maxReplicas', value));
    this.saveStore();
  }

  onAddChartsStore({url, name}) {
    this.setState(this.state.updateIn(['chartsStores'], chartsStores => {
      return chartsStores.push(Immutable.fromJS({url, name}));
    }));
    this.saveStore();
  }

  onRemoveChartsStore(url) {
    this.setState(this.state.updateIn(['chartsStores'], stores => {
      return stores.filter(store => store.get('url') !== url);
    }));
    this.saveStore();
  }

  onUpdateSelectedChartsStoreIndex(index) {
    this.setState(this.state.set('selectedChartsStoreIndex', index));
    this.saveStore();
  }

  saveStore() {
    AsyncStorage.setItem(this.displayName, alt.takeSnapshot(this));
  }

  static getEntitiesOrder() {
    return this.state.getIn(['entitiesDisplay', 'order']);
  }

  static getEntities() {
    return this.state.getIn(['entitiesDisplay', 'entities']);
  }

  static getEntitiesToDisplay() {
    const entities = this.getEntities();
    return this.getEntitiesOrder().reduce((list, i) => {
      if (!entities.getIn([`${i}`, 'hidden'])) {
        return list.push(entities.get(`${i}`));
      }
      return list;
    }, Immutable.List());
  }

  static getMaxReplicas() {
    return this.state.get('maxReplicas', 40);
  }

  static getChartsStores() {
    return this.state.get('chartsStores');
  }

  static getSelectedChartsStoreIndex() {
    return this.state.get('selectedChartsStoreIndex');
  }
}

export default alt.createStore(immutableUtil(SettingsStore), 'SettingsStore');
