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
          udi: '123456789',
          labels: {
            hostname: 'test',
            env: 'prod',
          },
        }},
      ],
    },
  },
});
