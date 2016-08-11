/*
  Copyright 2015 Skippbox, Ltd

  Licensed under the Apache License, Version 2.0 (the 'License');
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an 'AS IS' BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

export default class EntitiesUtils {

  static storeForType(entityType) {
    let find;
    for (const key in alt.stores) {
      if (alt.stores.hasOwnProperty(key)) {
        const store = alt.stores[key];
        if (store.getEntityType && store.getEntityType() === entityType) {
          find = store;
        }
      }
    }
    return find;
  }

  static newDeploymentParams({name, image, namespace = 'default'}) {
    return Immutable.fromJS({
      kind: 'Deployment',
      apiVersion: 'extensions/v1beta1',
      metadata: { name, namespace, labels: {run: name} },
      spec: {
        replicas: 1,
        selector: { matchLabels: {run: name}},
        template: {
          metadata: { labels: {run: name}},
          spec: { containers: [
            {name, image, resources: {}},
          ]},
        },
        strategy: {},
      },
      status: {},
    });
  }

  static newServiceParams({deployment, port, name}) {
    const deploymentName = deployment.getIn(['metadata', 'name']);
    port = parseInt(port, 10);
    return Immutable.fromJS({
      kind: 'Service',
      apiVersion: 'v1',
      metadata: {name, labels: {run: deploymentName}},
      spec: {
        ports: [{protocol: 'TCP', port, targetPort: port}],
        selector: {run: deploymentName},
      },
      status: {loadBalancer: {}},
    });
  }

  static statusForEntity(entity) {
    const { Status } = Constants;
    let status = entity.get('status');
    if (typeof status === 'object') {
      if (status.get('phase')) {
        status = status.get('phase').toUpperCase();
      } else if (status.get('conditions')) {
        const condition = status.get('conditions').find(c => c.get('type') === 'Ready');
        status = condition.get('status') === 'True' ? Status.READY : Status.NOTREADY;
        if (status === Status.READY && entity.get('kind') === 'nodes' && entity.getIn(['spec', 'unschedulable'])) {
          status = Status.READY_UNSCHEDULABLE;
        }
      }
    }
    return status;
  }
}
