import Immutable from 'immutable';
export default Immutable.fromJS({
  EndpointsStore: {
    'test.co': { url: 'test.co', name: 'Test Endpoint', username: 'foo', password: 'bar' },
  },
  NodesStore: {
    status: {'test.co': 'success'},
    nodes: {
      'test.co': [
        {metadata: {
          name: 'Node A',
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
    status: {'test.co': 'success'},
    services: {
      'test.co': [
        {metadata: { name: 'Service A' }},
        {metadata: { name: 'Service B' }},
        {metadata: { name: 'Service C' }},
      ],
    },
  },
  ReplicationsStore: {
    status: {'test.co': 'success'},
    replications: {
      'test.co': [
        {metadata: { name: 'Replication Controller A' }},
        {metadata: { name: 'Replication Controller B' }},
      ],
    },
  },
});
