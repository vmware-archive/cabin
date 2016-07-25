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
import InitActions from 'actions/InitActions';
import EntitiesActions from 'actions/EntitiesActions';
import Immutable from 'immutable';
import ImmutableUtils from 'utils/ImmutableUtils';
import FakeData from './FakeData';

export default class BaseEntitiesStore {

  constructor({entityType, persistent = false} = {}) {
    persistent && this.bindActions(InitActions);
    this.bindActions(EntitiesActions);
    if (__DEV__ && FakeData.get(this.displayName)) {
      this.state = FakeData.get(this.displayName);
    } else {
      this.state = Immutable.fromJS({
        status: {},
        entityType,
      }).set(entityType, Immutable.Map());
    }
    this.exportPublicMethods({
      get: this.get,
      getAll: this.getAll,
      getStatus: this.getStatus,
      getEntityType: this.getEntityType,
    });
  }

  onInitAppSuccess(appState) {
    if (appState.get(this.displayName)) {
      this.setState(this.state.mergeDeep(appState.get(this.displayName)));
      return true;
    }
    return false;
  }

  onFetchEntitiesStart({cluster, entityType}) {
    if (entityType === this.getEntityType()) {
      this.setState(this.state.setIn(['status', cluster.get('url')], 'loading'));
    }
  }

  onDispatchEntities({cluster, entities, entityType}) {
    if (entityType === this.getEntityType()) {
      this.setState(
        this.state.setIn([entityType, cluster.get('url')],
          ImmutableUtils.entitiesToMap(entities.map(e => e.set('kind', entityType))))
        .setIn(['status', cluster.get('url')], 'success')
      );
    }
  }

  onFetchEntitiesFailure({cluster, entityType}) {
    if (entityType === this.getEntityType()) {
      const entities = this.state.getIn([entityType, cluster.get('url')], Immutable.List());
      this.setState(this.state.setIn(['status', cluster.get('url')], entities.size === 0 ? 'failure' : 'success'));
    }
  }

  onDeleteEntityStart({cluster, entity, entityType}) {
    if (entityType === this.getEntityType()) {
      this.setState(this.state.deleteIn([entityType, cluster.get('url'), entity.getIn(['metadata', 'name'])]));
    }
  }

  onDeleteEntityFailure({cluster, entity, entityType}) {
    if (entityType === this.getEntityType()) {
      // TODO: warn user
      this.setState(this.state.setIn([entityType, cluster.get('url'), entity.getIn(['metadata', 'name'], entity)]));
    }
  }

  onAddEntityLabelStart({cluster, entity, entityType, key, value}) {
    if (entityType === this.getEntityType()) {
      this.setState(this.state.setIn([entityType, cluster.get('url'), entity.getIn(['metadata', 'name']), 'metadata', 'labels', key], value));
    }
  }

  onAddEntityLabelFailure({cluster, entity, entityType, key}) {
    if (entityType === this.getEntityType()) {
      this.setState(this.state.removeIn([entityType, cluster.get('url'), entity.getIn(['metadata', 'name']), 'metadata', 'labels', key]));
    }
  }

  onDeleteEntityLabelStart({cluster, entity, entityType, key}) {
    if (entityType === this.getEntityType()) {
      this.setState(this.state.removeIn([entityType, cluster.get('url'), entity.getIn(['metadata', 'name']), 'metadata', 'labels', key]));
    }
  }

  // Public methods
  getEntityType() {
    return this.state.get('entityType');
  }

  getStatus(cluster) {
    return this.state.getIn(['status', cluster.get('url')], 'success');
  }

  getAll(cluster) {
    return this.state.getIn([this.getEntityType(), cluster.get('url')], Immutable.List()).toList();
  }

  get({cluster, entity, name}) { // give entity or entity's name
    if (!name) {
      name = entity.getIn(['metadata', 'name']);
    }
    return this.state.getIn([this.getEntityType(), cluster.get('url'), name]);
  }

}
