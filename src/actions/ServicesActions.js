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

class ServicesActions {

  constructor() {
    this.generateActions(
      'fetchServicesStart',
      'fetchServicesSuccess',
      'fetchServicesFailure',
      'deleteServiceStart',
      'deleteServiceSuccess',
      'deleteServiceFailure',
      'addServiceLabelStart',
      'addServiceLabelSuccess',
      'addServiceLabelFailure',
      'deleteServiceLabelStart',
      'deleteServiceLabelSuccess',
      'deleteServiceLabelFailure',
      'updateServiceTypeStart',
      'updateServiceTypeSuccess',
      'updateServiceTypeFailure',
      'updateServicePortsStart',
      'updateServicePortsSuccess',
      'updateServicePortsFailure',
    );
  }

  fetchServices(cluster) {
    this.fetchServicesStart(cluster);
    return ClustersApi.fetchServices(cluster).then(services => {
      this.fetchServicesSuccess({cluster, services});
    })
    .catch(() => {
      this.fetchServicesFailure(cluster);
    });
  }

  deleteService({cluster, service}) {
    this.deleteServiceStart({cluster, service});
    return ClustersApi.deleteService({cluster, service}).then(() => {
      this.deleteServiceSuccess({cluster, service});
    }).catch(() => {
      this.deleteServiceFailure({cluster, service});
    });
  }

  addServiceLabel({cluster, service, key, value}) {
    this.addServiceLabelStart({cluster, service, key, value});
    return ClustersApi.addServiceLabel({cluster, service, key, value}).then(() => {
      this.addServiceLabelSuccess({cluster, service, key, value});
    }).catch(() => {
      this.addServiceLabelFailure({cluster, service, key, value});
    });
  }

  deleteServiceLabel({cluster, service, key}) {
    this.deleteServiceLabelStart({cluster, service, key});
    return ClustersApi.deleteServiceLabel({cluster, service, key}).then(() => {
      this.deleteServiceLabelSuccess({cluster, service, key});
    }).catch(() => {
      this.deleteServiceLabelFailure({cluster, service, key});
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
