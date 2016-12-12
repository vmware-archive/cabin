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
import ClustersApi from 'api/ClustersApi';
import EntitiesUtils from 'utils/EntitiesUtils';

class EntitiesActions {

  constructor() {
    this.generateActions(
      'dispatchEntities',
      'dispatchEntity',
      'fetchEntitiesStart',
      'fetchEntitiesFailure',
      'createEntityStart',
      'createEntitySuccess',
      'createEntityFailure',
      'deleteEntityStart',
      'deleteEntitySuccess',
      'deleteEntityFailure',
      'addEntityLabelStart',
      'addEntityLabelSuccess',
      'addEntityLabelFailure',
      'deleteEntityLabelStart',
      'deleteEntityLabelSuccess',
      'deleteEntityLabelFailure',
    );
  }

  fetchEntities({cluster, entityType, params}) {
    this.fetchEntitiesStart({cluster, entityType});
    return ClustersApi.fetchEntities({cluster, entityType, params}).then(response => {
      response.get('items') &&
        this.dispatchEntities({cluster, entityType, entities: response.get('items'), resourceVersion: response.getIn(['metadata', 'resourceVersion'])});
      return response.get('items', Immutable.List());
    })
    .catch((e) => {
      this.fetchEntitiesFailure({cluster, entityType});
      return Promise.reject(e);
    });
  }

  watchEntities({cluster, entityType}) {
    const store = EntitiesUtils.storeForType(entityType);
    let resourceVersion = 0;
    if (store && store.getResourceVersion) {
      resourceVersion = store.getResourceVersion(cluster);
    }
    return ClustersApi.watchEntities({cluster, entityType, params: {watch: true, resourceVersion}, onMessage: (data) => {
      if (data && data.get('object')) {
        const entity = data.get('object');
        this.dispatchEntity({cluster, entityType, entity});
      }
    }});
  }

  createEntity({cluster, params, namespace = 'default', entityType}) {
    this.createEntityStart({cluster, params, entityType});
    return ClustersApi.createEntity({cluster, params, entityType,
      entity: Immutable.fromJS({metadata: {namespace}})})
    .then((entity) => {
      this.createEntitySuccess({cluster, entity, entityType});
      return entity;
    }).catch((e) => {
      this.createEntityFailure({cluster, params, entityType});
      return Promise.reject(e);
    });
  }

  deleteEntity({cluster, entity, entityType}) {
    const params = { labelSelector: `run=${entity.getIn(['metadata', 'name'])}` };
    this.deleteEntityStart({cluster, entity, entityType});
    return ClustersApi.deleteEntity({cluster, entity, entityType}).then(() => {
      if (entityType === 'replications' || entityType === 'deployments') {
        Immutable.List(['services', 'pods', 'replicasets']).map(type => {
          ClustersApi.fetchEntities({cluster, entityType: type, params}).then(response => {
            response.get('items', Immutable.List()).map(e => this.deleteEntity({cluster, entity: e, entityType: type}));
          });
        });
      }
      this.deleteEntitySuccess({cluster, entity, entityType});
    }).catch(() => {
      this.deleteEntityFailure({cluster, entity, entityType});
    });
  }

  addEntityLabel({cluster, entity, entityType, key, value}) {
    this.addEntityLabelStart({cluster, entity, entityType, key, value});
    return ClustersApi.addEntityLabel({cluster, entity, entityType, key, value}).then(() => {
      this.addEntityLabelSuccess({cluster, entity, entityType, key, value});
    }).catch(() => {
      this.addEntityLabelFailure({cluster, entity, entityType, key, value});
      return Promise.reject();
    });
  }

  deleteEntityLabel({cluster, entity, entityType, key}) {
    this.deleteEntityLabelStart({cluster, entity, entityType, key});
    return ClustersApi.deleteEntityLabel({cluster, entity, entityType, key}).then(() => {
      this.deleteEntityLabelSuccess({cluster, entity, entityType, key});
    }).catch(() => {
      this.deleteEntityLabelFailure({cluster, entity, entityType, key});
    });
  }

}

export default alt.createActions(EntitiesActions);
