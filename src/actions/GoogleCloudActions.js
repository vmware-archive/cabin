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
import GoogleCloudApi from 'api/GoogleCloudApi';
import { GoogleSignin } from 'react-native-google-signin';
import { fromJS } from 'immutable';

class GoogleCloudActions {

  constructor() {
    this.generateActions(
      'signInSuccess',
      'signInFailure',
      'getProjectsStart',
      'getProjectsSuccess',
      'getProjectsFailure',
      'getZonesStart',
      'getZonesSuccess',
      'getZonesFailure',
    );
  }

  signIn() {
    return GoogleSignin.signIn().then((user) => {
      this.signInSuccess(fromJS(user));
    }).catch((err) => {
      this.signInFailure(err);
    });
  }

  getProjects(pageToken = null) {
    this.getProjectsStart();
    return GoogleCloudApi.getProjects(pageToken).then((response) => {
      this.getProjectsSuccess(response);
    }).catch((error) => {
      this.getProjectsFailure(error);
    });
  }

  getZones(projectId, pageToken = null) {
    this.getZonesStart();
    return GoogleCloudApi.getZones(projectId, pageToken).then((response) => {
      this.getZonesSuccess(response);
    }).catch((error) => {
      this.getZonesFailure(error);
    });
  }
}

export default alt.createActions(GoogleCloudActions);
