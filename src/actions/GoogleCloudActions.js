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
      'getProjectPolicyStart',
      'getProjectPolicySuccess',
      'getProjectPolicyFailure',
      'getZonesStart',
      'getZonesSuccess',
      'getZonesFailure',
      'getClustersStart',
      'getClustersSuccess',
      'getClustersFailure',
      'createClusterStart',
      'createClusterSuccess',
      'createClusterFailure',
      'setSelectedProjectId',
    );
  }

  signIn() {
    return GoogleSignin.currentUserAsync().then((user) => {
      if (!user) {
        return GoogleSignin.signIn();
      }
      return Promise.resolve(user);
    }).then((user) => {
      this.signInSuccess(fromJS(user));
    }).catch((error) => {
      this.signInFailure(error);
      return Promise.reject(error);
    });
  }

  signOut() {
    return GoogleSignin.signOut();
  }

  getProjects(pageToken) {
    this.getProjectsStart();
    return GoogleCloudApi.getProjects(pageToken).then((response) => {
      this.getProjectsSuccess(response);
      if (response.get('nextPageToken')) {
        return this.getProjects(response.get('nextPageToken'));
      }
      return Promise.resolve();
    }).catch((error) => {
      this.getProjectsFailure(error);
      return Promise.reject(error);
    });
  }

  getProjectPolicy(projectId) {
    this.getProjectPolicyStart(projectId);
    return GoogleCloudApi.getProjectPolicy(projectId).then((response) => {
      this.getProjectPolicySuccess({projectId, response});
    }).catch((error) => {
      this.getProjectPolicyFailure(error);
      return Promise.reject(error);
    });
  }

  getZones(projectId, pageToken) {
    this.getZonesStart();
    return GoogleCloudApi.getZones(projectId, pageToken).then((response) => {
      this.getZonesSuccess(response);
    }).catch((error) => {
      this.getZonesFailure(error);
      return Promise.reject(error);
    });
  }

  getClusters(projectId, zone = '-', pageToken) {
    this.getClustersStart(projectId);
    return GoogleCloudApi.getClusters(projectId, zone, pageToken).then((response) => {
      this.getClustersSuccess({projectId, response});
    }).catch((error) => {
      this.getClustersFailure({projectId, error});
      return Promise.reject(error);
    });
  }

  createCluster(projectId, zone, cluster) {
    this.createClusterStart();
    return GoogleCloudApi.createCluster(projectId, zone, cluster).then((response) => {
      this.createClusterSuccess(response);
    }).catch((error) => {
      this.createClusterFailure(error);
      return Promise.reject(error);
    });
  }
}

export default alt.createActions(GoogleCloudActions);
