import Immutable from 'immutable';
export default Immutable.fromJS({
  ClustersStore: {
    'test': { url: 'test', name: 'Test Cluster', username: 'foo', password: 'bar', status: 'UP' },
  },
  PodsStore: {
    status: {'test': 'success'},
    pods: {
      'test': [
        {metadata: {
          name: 'Pod A',
          resourceVersion: 99,
          uid: '123456789',
          labels: {
            hostname: 'test',
            env: 'prod',
          },
        }},
      ],
    },
  },
  ServicesStore: {
    status: {'test': 'success'},
    services: {
      'test': [
        {metadata: { name: 'Service A' }},
        {metadata: { name: 'Service B' }},
        {metadata: { name: 'Service C' }},
      ],
    },
  },
  ReplicationsStore: {
    status: {'test': 'success'},
    replications: {
      'test': [
        {metadata: { name: 'Replication Controller A' }},
        {metadata: { name: 'Replication Controller B' }},
      ],
    },
  },
});
