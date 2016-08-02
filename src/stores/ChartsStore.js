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
import ChartsActions from 'actions/ChartsActions';
import Immutable from 'immutable';
import immutableUtil from 'alt-utils/lib/ImmutableUtil';
import FakeData from './FakeData';

class ChartsStore {

  constructor() {
    this.bindActions(InitActions);
    this.bindActions(ChartsActions);
    if (__DEV__ && FakeData.get(this.displayName)) {
      this.state = FakeData.get(this.displayName);
    } else {
      this.state = Immutable.Map();
    }
    this.previousUrl;
  }

  onFetchChartsStart(url) {
    if (this.previousUrl !== url) {
      this.previousUrl = url;
      this.setState(Immutable.Map());
    }
  }

  onFetchChartsSuccess(charts) {
    return this.setState(charts);
  }

  static getAll() {
    return this.getState();
  }
}

export default alt.createStore(immutableUtil(ChartsStore), 'ChartsStore');
