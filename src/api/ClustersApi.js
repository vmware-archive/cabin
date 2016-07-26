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
      .then(() => Promise.resolve(true))
      .catch(() => Promise.resolve(false));
  }

  static fetchNamespaces(cluster) {
    return BaseApi.get('/api/v1/namespaces', {}, cluster).then(response => {
      return response.get('items').map(namespace => namespace.getIn(['metadata', 'name']));
    });
  }

  /* NODES */
  static fetchNodes(cluster) {
    return BaseApi.get('/api/v1/nodes', {}, cluster).then(response => {
      return response.get('items');
    });
  }

  static deleteNode({cluster, node}) {
    return BaseApi.delete(`/api/v1/nodes/${node.getIn(['metadata', 'name'])}`, {}, cluster, node);
  }

  static addNodeLabel({cluster, node, key, value}) {
    const body = {metadata: {
      labels: Immutable.Map([[key, value]]).toJS(),
    }};
    return BaseApi.patch(`/api/v1/nodes/${node.getIn(['metadata', 'name'])}`, body, cluster, node);
  }

  static deleteNodeLabel({cluster, node, key}) {
    const body = {metadata: {
      labels: Immutable.Map([[key, null]]).toJS(),
    }};
    return BaseApi.patch(`/api/v1/nodes/${node.getIn(['metadata', 'name'])}`, body, cluster, node);
  }

  /* PODS */
  static fetchPodLogs({cluster, pod, container}) {
    return BaseApi.get(`/pods/${pod.getIn(['metadata', 'name'])}/log`, {container, tailLines: 100}, cluster, pod);
  }

  static execPodCommand({cluster, pod, command, container}) {
    return BaseApi.post(`/pods/${pod.getIn(['metadata', 'name'])}/exec`, {container, command}, cluster, pod);
  }

  /* RC */
  static scaleReplication({cluster, replication, replicas}) {
    const body = {spec: {replicas}};
    return BaseApi.patch(`/replicationcontrollers/${replication.getIn(['metadata', 'name'])}`, body, cluster, replication);
  }

  /* DEPLOYMENTS */
  static scaleDeployment({cluster, deployment, replicas}) {
    const body = {spec: {replicas}};
    return BaseApi.patch(`/deployments/${deployment.getIn(['metadata', 'name'])}`, body, cluster, deployment);
  }

  /* SERVICES */
  static updateServiceType({cluster, service, type}) {
    const body = {spec: { type }};
    if (type === 'ClusterIP') {
      body.spec.ports = service.getIn(['spec', 'ports'], Immutable.List()).map(port => port.set('nodePort', 0)).toJS();
    }
    return BaseApi.patch(`/services/${service.getIn(['metadata', 'name'])}`, body, cluster, service);
  }

  static updateServicePorts({cluster, service, ports}) {
    const body = {spec: { ports }};
    return BaseApi.patch(`/services/${service.getIn(['metadata', 'name'])}`, body, cluster, service);
  }

  /* GENERAL ENTITIES */
  static fetchEntities({cluster, entityType}) {
    return BaseApi.get(`/${entityType}`, {}, cluster).then(response => {
      return response.get('items');
    });
  }

  static deleteEntity({cluster, entity, entityType}) {
    return BaseApi.delete(`/${entityType}/${entity.getIn(['metadata', 'name'])}`, {}, cluster, entity);
  }

  static addEntityLabel({cluster, entity, entityType, key, value}) {
    const body = {metadata: {
      labels: Immutable.Map([[key, value]]).toJS(),
    }};
    return BaseApi.patch(`/${entityType}/${entity.getIn(['metadata', 'name'])}`, body, cluster, entity);
  }

  static deleteEntityLabel({cluster, entity, entityType, key}) {
    const body = {metadata: {
      labels: Immutable.Map([[key, null]]).toJS(),
    }};
    return BaseApi.patch(`/${entityType}/${entity.getIn(['metadata', 'name'])}`, body, cluster, entity);
  }

}

export default ClustersApi;


// https://185.19.30.238:443/api/v1/namespaces/default/pods/ghost-3378155678-81hth/exec?command=date&container=ghost&container=ghost&stderr=true&stdout=true
// https://185.19.30.238:443/api/v1/namespaces/default/pods/ghost-3378155678-81hth/exec?container=ghost&command=date&stderr=true&stdout=true
