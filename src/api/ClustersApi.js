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
import BaseApi from './BaseApi';

class ClustersApi {
  static checkCluster(cluster) {
    return BaseApi.get(`${cluster.get('url')}/api/v1`, {}, cluster)
      .then(response => Promise.resolve({ up: true, response }))
      .catch(() => Promise.resolve({ up: false }));
  }

  static fetchNamespaces(cluster) {
    return BaseApi.get('/api/v1/namespaces', {}, cluster).then(response => {
      return response.get
        ? response
            .get('items')
            .map(namespace => namespace.getIn(['metadata', 'name']))
        : Immutable.List();
    });
  }

  static createNamespace({ cluster, namespace }) {
    const params = {
      kind: 'Namespace',
      apiVersion: 'v1',
      metadata: { name: namespace },
    };
    return BaseApi.post('/api/v1/namespaces', params, cluster);
  }

  /* NODES */
  static deleteNode({ cluster, node }) {
    return BaseApi.delete(
      `/api/v1/nodes/${node.getIn(['metadata', 'name'])}`,
      {},
      cluster,
      node
    );
  }

  static addNodeLabel({ cluster, node, key, value }) {
    const body = {
      metadata: {
        labels: Immutable.Map([[key, value]]).toJS(),
      },
    };
    return BaseApi.patch(
      `/api/v1/nodes/${node.getIn(['metadata', 'name'])}`,
      body,
      cluster,
      node
    );
  }

  static deleteNodeLabel({ cluster, node, key }) {
    const body = {
      metadata: {
        labels: Immutable.Map([[key, null]]).toJS(),
      },
    };
    return BaseApi.patch(
      `/api/v1/nodes/${node.getIn(['metadata', 'name'])}`,
      body,
      cluster,
      node
    );
  }

  static setSchedulable({ cluster, node, schedulable }) {
    const body = {
      spec: {
        unschedulable: !schedulable,
      },
    };
    return BaseApi.patch(
      `/api/v1/nodes/${node.getIn(['metadata', 'name'])}`,
      body,
      cluster,
      node
    );
  }

  static getNodePods({ cluster, node }) {
    const body = {
      fieldSelector: `spec.nodeName=${node.getIn(['metadata', 'name'])}`,
    };
    return BaseApi.get('/api/v1/pods', body, cluster).then(r => r.get('items'));
  }

  static getTillerPod(cluster) {
    const body = {
      labelSelector: 'app=helm,name=tiller',
    };
    return BaseApi.get('/api/v1/pods', body, cluster).then(pods => {
      return pods.get('items').first();
    });
  }

  /* PODS */
  static fetchPodLogs({ cluster, pod, container }) {
    return BaseApi.get(
      `/pods/${pod.getIn(['metadata', 'name'])}/log`,
      { container, tailLines: 100 },
      cluster,
      pod
    );
  }

  static execPodCommand({ cluster, pod, command, container }) {
    command = command.split(' ');
    return BaseApi.websocket({
      url: `/pods/${pod.getIn(['metadata', 'name'])}/exec`,
      dataUrl: { container, command },
      cluster,
      entity: pod,
    });
  }

  /* RC */
  static scaleReplication({ cluster, replication, replicas }) {
    const body = { spec: { replicas } };
    return BaseApi.patch(
      `/replicationcontrollers/${replication.getIn(['metadata', 'name'])}`,
      body,
      cluster,
      replication
    );
  }

  /* DEPLOYMENTS */
  static scaleDeployment({ cluster, deployment, replicas }) {
    const body = { spec: { replicas } };
    return BaseApi.patch(
      `/deployments/${deployment.getIn(['metadata', 'name'])}`,
      body,
      cluster,
      deployment
    );
  }

  static rollingUpdate({ cluster, deployment, image }) {
    const container = deployment
      .getIn(['spec', 'template', 'spec', 'containers'], Immutable.List())
      .first();
    const body = {
      spec: {
        template: {
          spec: {
            containers: [{ image, name: container.get('name') }],
          },
        },
      },
    };
    return BaseApi.patch(
      `/deployments/${deployment.getIn(['metadata', 'name'])}`,
      body,
      cluster,
      deployment
    );
  }

  static rollbackDeployment({ cluster, deployment, revision }) {
    const body = {
      kind: 'DeploymentRollback',
      apiVersion: 'extensions/v1beta1',
      name: deployment.getIn(['metadata', 'name']),
      rollbackTo: { revision },
    };
    return BaseApi.post(
      `/deployments/${deployment.getIn(['metadata', 'name'])}/rollback`,
      body,
      cluster,
      deployment
    );
  }

  /* HORIZONTAL POD AUTOSCALERS */
  static updateHPASpec({ cluster, hpa, spec }) {
    const body = { spec };
    return BaseApi.patch(
      `/horizontalpodautoscalers/${hpa.getIn(['metadata', 'name'])}`,
      body,
      cluster,
      hpa
    );
  }

  /* SERVICES */
  static fetchService({ cluster, service }) {
    return BaseApi.get(
      `/services/${service.getIn(['metadata', 'name'])}`,
      {},
      cluster,
      service
    );
  }

  static updateServiceType({ cluster, service, type }) {
    const body = { spec: { type } };
    if (type === 'ClusterIP') {
      body.spec.ports = service
        .getIn(['spec', 'ports'], Immutable.List())
        .map(port => port.set('nodePort', 0))
        .toJS();
    }
    return BaseApi.patch(
      `/services/${service.getIn(['metadata', 'name'])}`,
      body,
      cluster,
      service
    );
  }

  static updateServicePorts({ cluster, service, ports }) {
    const body = { spec: { ports } };
    return BaseApi.patch(
      `/services/${service.getIn(['metadata', 'name'])}`,
      body,
      cluster,
      service
    );
  }

  /* GENERAL ENTITIES */
  static fetchEntities({ cluster, entityType, params = {} }) {
    return BaseApi.get(`/${entityType}`, params, cluster).then(response => {
      return typeof response.get === 'function' ? response : Immutable.Map();
    });
  }

  static watchEntities({ cluster, entityType, params = {}, onMessage }) {
    return BaseApi.websocket({
      url: `/${entityType}`,
      dataUrl: params,
      cluster,
      onMessage,
    });
  }

  static createEntity({ cluster, params, entity, entityType }) {
    return BaseApi.post(`/${entityType}`, params.toJS(), cluster, entity);
  }

  static deleteEntity({ cluster, entity, entityType }) {
    return BaseApi.delete(
      `/${entityType}/${entity.getIn(['metadata', 'name'])}`,
      {},
      cluster,
      entity
    );
  }

  static addEntityLabel({ cluster, entity, entityType, key, value }) {
    const body = {
      metadata: {
        labels: Immutable.Map([[key, value]]).toJS(),
      },
    };
    return BaseApi.patch(
      `/${entityType}/${entity.getIn(['metadata', 'name'])}`,
      body,
      cluster,
      entity
    );
  }

  static deleteEntityLabel({ cluster, entity, entityType, key }) {
    const body = {
      metadata: {
        labels: Immutable.Map([[key, null]]).toJS(),
      },
    };
    return BaseApi.patch(
      `/${entityType}/${entity.getIn(['metadata', 'name'])}`,
      body,
      cluster,
      entity
    );
  }
}

export default ClustersApi;
