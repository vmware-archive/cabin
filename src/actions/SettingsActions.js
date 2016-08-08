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

class SettingsActions {

  constructor() {
    this.generateActions(
      'updateEntitiesOrder',
      'setEntityHidden',
      'updateMaxReplicas',
      'addChartsStoreStart',
      'addChartsStoreSuccess',
      'addChartsStoreFailure',
      'removeChartsStore',
      'updateSelectedChartsStoreIndex',
    );
  }

  addChartsStore({url, name}) {
    if (url.slice(-1) === '/') {
      url = url + 'index.yaml';
    }
    this.addChartsStoreStart({url, name});
    return ChartsApi.fetchCharts(url).then(charts => {
      if (charts.size > 0) {
        this.addChartsStoreSuccess({url, name});
        return Promise.resolve();
      }
      this.addChartsStoreFailure({url, name});
      return Promise.reject();
    }).catch(() => {
      this.addChartsStoreFailure({url, name});
      return Promise.reject();
    });
  }
}

export default alt.createActions(SettingsActions);
