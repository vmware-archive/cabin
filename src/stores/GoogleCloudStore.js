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
import GoogleCloudActions from 'actions/GoogleCloudActions';
import { Map } from 'immutable';
import immutableUtil from 'alt-utils/lib/ImmutableUtil';

class GoogleCloudStore {

  constructor() {
    this.bindActions(GoogleCloudActions);
    this.state = new Map();
  }

  onSignInSuccess(user) {
    this.setState(this.state.set('user', user));
  }

  onGetProjectsStart() {
    this.setState(this.state.setIn(['projects', 'loading'], true));
  }

  onGetProjectsSuccess(response) {
    const newState = this.state.withMutations(state => {
      state.setIn(['projects', 'list'], response.get('projects').filter(p => p.get('lifecycleState') === 'ACTIVE'))
           .setIn(['projects', 'nextPageToken'], response.get('nextPageToken'))
           .setIn(['projects', 'loading'], false);
    });
    this.setState(newState);
  }

  onGetProjectsFailure(error) {
    const newState = this.state.withMutations(state => {
      state.setIn(['projects', 'error'], error)
           .setIn(['projects', 'loading'], false);
    });
    this.setState(newState);
  }

  onGetZonesStart() {
    this.setState(this.state.setIn(['zones', 'loading'], true));
  }

  onGetZonesSuccess(response) {
    const newState = this.state.withMutations(state => {
      state.setIn(['zones', 'list'], response.get('items'))
           .setIn(['zones', 'nextPageToken'], response.get('nextPageToken'))
           .setIn(['zones', 'loading'], false);
    });
    this.setState(newState);
  }

  onGetZonesFailure(error) {
    const newState = this.state.withMutations(state => {
      state.setIn(['zones', 'error'], error)
           .setIn(['zones', 'loading'], false);
    });
    this.setState(newState);
  }

  onGetClustersStart() {
    this.setState(this.state.setIn(['clusters', 'loading'], true));
  }

  onGetClustersSuccess(response) {
    const newState = this.state.withMutations(state => {
      state.setIn(['clusters', 'list'], response.get('clusters'))
           .setIn(['clusters', 'nextPageToken'], response.get('nextPageToken'))
           .setIn(['clusters', 'loading'], false);
    });
    this.setState(newState);
  }

  onGetClustersFailure(error) {
    const newState = this.state.withMutations(state => {
      state.setIn(['clusters', 'error'], error)
           .setIn(['clusters', 'loading'], false);
    });
    this.setState(newState);
  }

  static getUser() {
    return this.state.get('user');
  }

  static getProjects() {
    return this.state.getIn(['projects', 'list'], Immutable.List());
  }

  static getZones() {
    return this.state.getIn(['zones', 'list'], Immutable.List());
  }

  static getClusters() {
    return this.state.getIn(['clusters', 'list'], Immutable.List());
  }
}

export default alt.createStore(immutableUtil(GoogleCloudStore), 'GoogleCloudStore');
