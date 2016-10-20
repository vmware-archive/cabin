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
import ChartsApi from 'api/ChartsApi';
import ServicesActions from 'actions/ServicesActions';

class ReleasesActions {

  constructor() {
    this.generateActions(
      'fetchReleasesStart',
      'fetchReleasesSuccess',
      'fetchReleasesFailure',
      'deleteReleaseStart',
      'deleteReleaseSuccess',
      'deleteReleaseFailure',
    );
  }

  fetchReleases(cluster) {
    this.fetchReleasesStart(cluster);
    return ServicesActions.getTillerService(cluster).then(service => {
      if (!service) {
        this.fetchReleasesFailure({cluster});
        return Immutable.List();
      }
      return ChartsApi.fetchReleases({cluster, service}).then(releases => {
        this.fetchReleasesSuccess({cluster, releases});
        return releases;
      });
    });
  }

  deleteRelease({cluster, release}) {
    this.deleteReleaseStart({cluster, release});
    return ServicesActions.getTillerService(cluster).then(service => {
      if (!service) {
        this.deleteReleaseFailure({cluster, release});
        return false;
      }
      return ChartsApi.deleteRelease({cluster, release, service}).then(() => {
        this.deleteReleaseSuccess({cluster});
        return true;
      });
    });
  }
}

export default alt.createActions(ReleasesActions);
