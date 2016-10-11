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
import EntitiesActions from 'actions/EntitiesActions';
import EntitiesUtils from 'utils/EntitiesUtils';

const entityType = 'services';

class ServicesActions {

  constructor() {
    this.generateActions(
      'updateServiceTypeStart',
      'updateServiceTypeSuccess',
      'updateServiceTypeFailure',
      'updateServicePortsStart',
      'updateServicePortsSuccess',
      'updateServicePortsFailure',
    );
  }

  fetchServices(cluster) {
    EntitiesActions.fetchEntitiesStart({cluster, entityType});
    return ClustersApi.fetchEntities({cluster, entityType}).then(entities => {
      EntitiesActions.dispatchEntities({cluster, entityType, entities});
      return entities;
    })
    .catch(() => {
      EntitiesActions.fetchEntitiesFailure({cluster, entityType});
    });
  }

  deleteService({cluster, service}) {
    EntitiesActions.deleteEntityStart({cluster, entity: service, entityType});
    return ClustersApi.deleteEntity({cluster, entity: service, entityType}).then(() => {
      EntitiesActions.deleteEntitySuccess({cluster, entity: service, entityType});
    }).catch(() => {
      EntitiesActions.deleteEntityFailure({cluster, entity: service, entityType});
    });
  }

  createService({cluster, deployment, port, name, type}) {
    const params = EntitiesUtils.newServiceParams({deployment, port, name, type});
    return EntitiesActions.createEntity({cluster, entityType, params, namespace: deployment.getIn(['metadata', 'namespace'])});
  }

  fetchService({cluster, service}) {
    return ClustersApi.fetchService({cluster, service});
  }

  addServiceLabel({cluster, service, key, value}) {
    EntitiesActions.addEntityLabelStart({cluster, entity: service, entityType, key, value});
    return ClustersApi.addEntityLabel({cluster, entity: service, entityType, key, value}).then(() => {
      EntitiesActions.addEntityLabelSuccess({cluster, entity: service, entityType, key, value});
    }).catch(() => {
      EntitiesActions.addEntityLabelFailure({cluster, entity: service, entityType, key, value});
      return Promise.reject();
    });
  }

  deleteServiceLabel({cluster, service, key}) {
    EntitiesActions.deleteEntityLabelStart({cluster, entity: service, entityType, key});
    return ClustersApi.deleteEntityLabel({cluster, entity: service, entityType, key}).then(() => {
      EntitiesActions.deleteEntityLabelSuccess({cluster, entity: service, entityType, key});
    }).catch(() => {
      EntitiesActions.deleteEntityLabelFailure({cluster, entity: service, entityType, key});
    });
  }

  updateServiceType({cluster, service, type}) {
    this.updateServiceTypeStart({cluster, service, type});
    return ClustersApi.updateServiceType({cluster, service, type}).then((svc) => {
      this.updateServiceTypeSuccess({cluster, service: svc, type});
    }).catch(() => {
      this.updateServiceTypeFailure({cluster, service, type});
    });
  }

  updateServicePorts({cluster, service, ports}) {
    this.updateServicePortsStart({cluster, service, ports});
    return ClustersApi.updateServicePorts({cluster, service, ports: ports.toJS()}).then(entity => {
      this.updateServicePortsSuccess({cluster, service: entity.set('kind', 'services')});
      return entity;
    }).catch(e => {
      this.updateServicePortsFailure({cluster, service, ports});
      return Promise.reject(e);
    });
  }

}

export default alt.createActions(ServicesActions);
