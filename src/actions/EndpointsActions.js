import alt from 'src/alt';
class EndpointsActions {

  constructor() {
    this.generateActions(
      'addEndpoint',
    );
  }

}

export default alt.createActions(EndpointsActions);
