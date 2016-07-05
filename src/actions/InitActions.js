import alt from 'src/alt';
import { AsyncStorage } from 'react-native';

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
    return AsyncStorage.multiGet(Object.keys(alt.stores)).then(results => {
      return Immutable.fromJS(results)
        .filter(data => data.get(1)) // remove null
        .map(data => Immutable.fromJS(JSON.parse(data.get(1))))
        .toMap()
        .flatten(1);
    }).then( (appState) => {
      return this.initAppSuccess(appState);
    });
  }

}

export default alt.createActions(InitActions);
