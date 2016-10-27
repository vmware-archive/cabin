import Immutable from 'immutable';
export default Immutable.fromJS({
  ClustersStore: {
    'test': { url: 'test', name: 'Test Cluster', username: 'foo', password: 'bar', status: 'RUNNING', namespaces: ['default', 'custom-namespace'] },
  },
  PodsStore: {
    entityType: 'pods',
    status: {'test': 'success'},
    logs: {
      'test': {
        'Pod-A': '2016-07-13 23:45:12: log Pod A',
      },
    },
    pods: {
      'test': {
        'Pod-A': {
          kind: 'pods',
          metadata: {
            name: 'Pod-A',
            resourceVersion: 99,
            uid: '123456789',
            labels: {
              hostname: 'test',
              env: 'prod',
            },
          },
          status: {
            containerStatuses: [
              { ready: true },
              { ready: true },
            ],
          },
          spec: {
            containers: [
              { name: 'Container-1', image: 'image-nginx-test' },
              { name: 'Container-2', image: 'image-nginx-test' },
            ],
          },
        },
      },
    },
  },
  ServicesStore: {
    entityType: 'services',
    status: {'test': 'success'},
    services: {
      'test': {
        'Service A': {kind: 'services', metadata: { name: 'Service A', creationTimestamp: '2016-07-14T23:45:20Z' }, spec: { type: 'ClusterIP', ports: [{name: 'https', port: '443', targetPort: '443', protocol: 'TCP'}]}},
        'Service B': {kind: 'services', metadata: { name: 'Service B', creationTimestamp: '2015-07-14T23:45:20Z' }, spec: { type: 'ClusterIP', ports: [{name: 'https', port: '443', targetPort: '443', protocol: 'TCP'}]}},
      },
    },
  },
  ReplicationsStore: {
    entityType: 'replicationcontrollers',
    status: {'test': 'success'},
    replications: {
      'test': {
        'RC-A': {kind: 'replicationcontrollers', metadata: { name: 'RC-A', creationTimestamp: '2016-07-14T23:45:20Z'}, spec: {replicas: 1}},
        'RC-B': {kind: 'replicationcontrollers', metadata: { name: 'RC-B', creationTimestamp: '2016-07-14T23:45:20Z'}, spec: {replicas: 3}},
      },
    },
  },
  DeploymentsStore: {
    entityType: 'deployments',
    status: {'test': 'success'},
    deployments: {
      'test': {
        'Deployment-A': {kind: 'deployments', metadata: { name: 'Deployment-A', creationTimestamp: '2016-07-14T23:45:20Z'}, spec: {replicas: 1}},
      },
    },
  },
  NodesStore: {
    entityType: 'nodes',
    status: {'test': 'success'},
    nodes: {
      'test': {
        'Node-A': { kind: 'nodes',
          metadata: { name: 'Node-A', creationTimestamp: '2016-07-14T23:45:20Z'},
          status: {
            addresses: [{address: '10.11.12.13', type: 'InternalIP'}],
            conditions: [{type: 'Ready', status: 'True'}],
          },
        },
      },
    },
  },
  ReleasesStore: {
    status: {'test': 'success'},
    releases: {
      'test': [
        { name: 'Release-A', chart: { name: 'chart A' }, info: {} },
        { name: 'Release-B', chart: { name: 'chart A' }, info: {} },
      ],
    },
  },
});
