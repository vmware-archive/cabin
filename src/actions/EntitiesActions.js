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

class EntitiesActions {

  constructor() {
    this.generateActions(
      'dispatchEntities',
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

  fetchEntities({cluster, entityType}) {
    this.fetchEntitiesStart({cluster, entityType});
    return ClustersApi.fetchEntities({cluster, entityType}).then(entities => {
      this.dispatchEntities({cluster, entityType, entities});
    })
    .catch(() => {
      this.fetchEntitiesFailure({cluster, entityType});
    });
  }

  createEntity({cluster, params, namespace = 'default', entityType}) {
    this.createEntityStart({cluster, params, entityType});
    return ClustersApi.createEntity({cluster, params, entityType,
      entity: Immutable.fromJS({metadata: {namespace}})})
    .then((entity) => {
      this.createEntitySuccess({cluster, entity, entityType});
    }).catch((e) => {
      this.createEntityFailure({cluster, params, entityType});
      return Promise.reject(e);
    });
  }

  deleteEntity({cluster, entity, entityType}) {
    this.deleteEntityStart({cluster, entity, entityType});
    return ClustersApi.deleteEntity({cluster, entity, entityType}).then(() => {
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
