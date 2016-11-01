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
import alt from 'src/alt';
import InitActions from 'actions/InitActions';
import ReleasesActions from 'actions/ReleasesActions';
import Immutable from 'immutable';
import immutableUtil from 'alt-utils/lib/ImmutableUtil';
import FakeData from './FakeData';

class ReleasesStore {

  constructor() {
    this.bindActions(InitActions);
    this.bindActions(ReleasesActions);
    if (__DEV__ && FakeData.get(this.displayName)) {
      this.state = FakeData.get(this.displayName);
    } else {
      this.state = Immutable.fromJS({
        releases: {}, status: {}, error: {},
      });
    }
  }

  onFetchReleasesStart(cluster) {
    this.setState(this.state.setIn(['status', cluster.get('url')], 'loading'));
  }

  onFetchReleasesSuccess({cluster, releases}) {
    this.setState(this.state.setIn(['releases', cluster.get('url')], releases)
      .setIn(['status', cluster.get('url')], 'success'));
  }

  onFetchReleasesFailure({cluster, error}) {
    this.setState(this.state.setIn(['error', cluster.get('url')], error)
      .setIn(['status', cluster.get('url')], 'failure'));
  }

  onDeleteReleaseStart({cluster, release}) {
    this.setState(this.state.updateIn(['releases', cluster.get('url')], releases => {
      return releases.filter(r => !Immutable.is(r, release));
    }));
  }

  static getAll(cluster) {
    return this.state.getIn(['releases', cluster.get('url')], Immutable.List());
  }

  static getStatus(cluster) {
    return this.state.getIn(['status', cluster.get('url')], 'success');
  }

  static getError(cluster) {
    return this.state.getIn(['error', cluster.get('url')], {message: null}).message;
  }

}

export default alt.createStore(immutableUtil(ReleasesStore), 'ReleasesStore');
