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

const defaultChartStore = Immutable.fromJS({
  url: 'http://storage.googleapis.com/skippbox-charts/index.yaml',
  name: 'Helm Charts Store',
});
class SettingsStore {
  constructor() {
    this.bindActions(SettingsActions);
    this.bindActions(InitActions);
    this.state = Immutable.fromJS({
      maxReplicas: 40,
      chartsStores: [defaultChartStore],
      selectedChartsStoreIndex: 0,
      entitiesDisplay: {
        order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        entities: {
          0: { name: 'pods' },
          1: { name: 'services' },
          2: { name: 'nodes' },
          3: { name: 'deployments' },
          4: { name: 'replicationcontrollers', hidden: true },
          5: { name: 'helmreleases', hidden: true },
          6: { name: 'replicasets', hidden: true },
          7: { name: 'secrets', hidden: true },
          8: { name: 'serviceaccounts', hidden: true },
          9: { name: 'persistentvolumes', hidden: true },
          10: { name: 'persistentvolumeclaims', hidden: true },
          11: { name: 'ingresses', hidden: true },
          12: { name: 'configmaps', hidden: true },
          13: { name: 'horizontalpodautoscalers', hidden: true },
        },
      },
    });
  }

  onInitAppSuccess(appState) {
    if (appState.get(this.displayName)) {
      let state = this.state.merge(appState.get(this.displayName));
      if (
        state.getIn(['entitiesDisplay', 'order']).size <
        this.state.getIn(['entitiesDisplay', 'order']).size
      ) {
        state = state
          .setIn(
            ['entitiesDisplay', 'order'],
            this.state.getIn(['entitiesDisplay', 'order'])
          )
          .setIn(
            ['entitiesDisplay', 'entities'],
            this.state.getIn(['entitiesDisplay', 'entities'])
          );
      }
      if (!Immutable.is(state.getIn(['chartsStores', 0]), defaultChartStore)) {
        state = state.setIn(['chartsStores', 0], defaultChartStore);
      }
      this.setState(state);
      return true;
    }
    return false;
  }

  onUpdateEntitiesOrder(order) {
    this.setState(this.state.setIn(['entitiesDisplay', 'order'], order));
    this.saveStore();
  }

  onSetEntityHidden({ key, hidden }) {
    this.setState(
      this.state.setIn(
        ['entitiesDisplay', 'entities', `${key}`, 'hidden'],
        hidden
      )
    );
    this.saveStore();
  }

  onUpdateMaxReplicas(value) {
    this.setState(this.state.set('maxReplicas', value));
    this.saveStore();
  }

  onAddChartsStoreSuccess({ url, name }) {
    this.setState(
      this.state.updateIn(['chartsStores'], chartsStores => {
        return chartsStores.push(Immutable.fromJS({ url, name }));
      })
    );
    this.saveStore();
  }

  onAddChartsStoreFailure({ url }) {
    this.setState(
      this.state.updateIn(['chartsStores'], chartsStores => {
        return chartsStores.filter(store => store.get('url') !== url);
      })
    );
  }

  onRemoveChartsStore(url) {
    this.setState(
      this.state.updateIn(['chartsStores'], stores => {
        return stores.filter(store => store.get('url') !== url);
      })
    );
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
    const index = this.state.get('selectedChartsStoreIndex');
    return index < this.getChartsStores().size ? index : 0;
  }
}

export default alt.createStore(immutableUtil(SettingsStore), 'SettingsStore');
