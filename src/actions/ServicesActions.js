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
    EntitiesActions.fetchEntitiesStart({cluster, entityType: 'services'});
    return ClustersApi.fetchServices(cluster).then(entities => {
      EntitiesActions.dispatchEntities({cluster, entityType: 'services', entities});
    })
    .catch(() => {
      EntitiesActions.fetchEntitiesFailure({cluster, entityType: 'services'});
    });
  }

  deleteService({cluster, service}) {
    EntitiesActions.deleteEntityStart({cluster, entity: service, entityType: 'services'});
    return ClustersApi.deleteService({cluster, service}).then(() => {
      EntitiesActions.deleteEntitySuccess({cluster, entity: service, entityType: 'services'});
    }).catch(() => {
      EntitiesActions.deleteEntityFailure({cluster, entity: service, entityType: 'services'});
    });
  }

  addServiceLabel({cluster, service, key, value}) {
    EntitiesActions.addEntityLabelStart({cluster, entity: service, entityType: 'services', key, value});
    return ClustersApi.addServiceLabel({cluster, service, key, value}).then(() => {
      EntitiesActions.addEntityLabelSuccess({cluster, entity: service, entityType: 'services', key, value});
    }).catch(() => {
      EntitiesActions.addEntityLabelFailure({cluster, entity: service, entityType: 'services', key, value});
    });
  }

  deleteServiceLabel({cluster, service, key}) {
    EntitiesActions.deleteEntityLabelStart({cluster, entity: service, entityType: 'services', key});
    return ClustersApi.deleteServiceLabel({cluster, service, key}).then(() => {
      EntitiesActions.deleteEntityLabelSuccess({cluster, entity: service, entityType: 'services', key});
    }).catch(() => {
      EntitiesActions.deleteEntityLabelFailure({cluster, entity: service, entityType: 'services', key});
    });
  }

  updateServiceType({cluster, service, type}) {
    this.updateServiceTypeStart({cluster, service, type});
    return ClustersApi.updateServiceType({cluster, service, type}).then(() => {
      this.updateServiceTypeSuccess({cluster, service, type});
    }).catch(() => {
      this.updateServiceTypeFailure({cluster, service, type});
    });
  }

  updateServicePorts({cluster, service, ports}) {
    this.updateServicePortsStart({cluster, service, ports});
    return ClustersApi.updateServicePorts({cluster, service, ports: ports.toJS()}).then(() => {
      this.updateServicePortsSuccess({cluster, service, ports});
    }).catch(() => {
      this.updateServicePortsFailure({cluster, service, ports});
    });
  }
}

export default alt.createActions(ServicesActions);
