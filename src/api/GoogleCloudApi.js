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
import BaseApi from './BaseApi';
import { GoogleSignin } from 'react-native-google-signin';

export default class GoogleCloudApi {

  static configureGoogleSignin() {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      iosClientId: APP_CONFIG.GOOGLE_CLIENT_ID,
    });
  }

  static getProjects(pageToken) {
    return BaseApi.get('https://cloudresourcemanager.googleapis.com/v1/projects',
      {
        pageToken,
      },
    );
  }

  static getProjectPolicy(projectId) {
    return BaseApi.post(`https://cloudresourcemanager.googleapis.com/v1/projects/${projectId}:getIamPolicy`, {});
  }

  static getZones(projectId, pageToken) {
    return BaseApi.get(`https://www.googleapis.com/compute/v1/projects/${projectId}/zones`,
      {
        pageToken,
      },
    );
  }

  static getClusters(projectId, zone, pageToken) {
    return BaseApi.get(`https://container.googleapis.com/v1/projects/${projectId}/zones/${zone}/clusters`,
      {
        pageToken,
      },
    );
  }

  static createCluster(projectId, zone, cluster) {
    return BaseApi.post(`https://container.googleapis.com/v1/projects/${projectId}/zones/${zone}/clusters`, {cluster});
  }
}
