import alt from 'src/alt';
class InitActions {

  constructor() {
    this.generateActions(
      'initAppStart',
      'initAppSuccess',
      'initAppFailure',
    );
  }

  initializeApplication() {
    this.initAppStart();
    // do launch work there
    this.initAppSuccess();
  }

}

export default alt.createActions(InitActions);
