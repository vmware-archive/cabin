import alt from 'src/alt';
class EndpointsActions {

  constructor() {
    this.generateActions(
      'addEndpoint',
      'removeEndpoint',
    );
  }

}

export default alt.createActions(EndpointsActions);
