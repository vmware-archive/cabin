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
          name: 'Test Node',
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
        {metadata: {
          name: 'Test Services',
        }},
      ],
    },
  },
  ReplicationsStore: {
    status: {'test.co': 'success'},
    replications: {
      'test.co': [
        {metadata: {
          name: 'Test Replication',
        }},
      ],
    },
  },
});
