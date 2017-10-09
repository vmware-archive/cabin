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
import NodesActions from 'actions/NodesActions';
import immutableUtil from 'alt-utils/lib/ImmutableUtil';
import BaseEntitiesStore from './BaseEntitiesStore';
import SnackbarUtils from 'utils/SnackbarUtils';

class NodesStore extends BaseEntitiesStore {

  constructor() {
    super({entityType: 'nodes', persistent: true});
    this.bindActions(NodesActions);
  }

  onSetSchedulableStart({cluster, node, schedulable}) {
    this.setState(this.state.setIn(['nodes', cluster.get('url'), node.getIn(['metadata', 'uid']), 'spec', 'unschedulable'], !schedulable));
  }

  onSetSchedulableFailure({cluster, node, schedulable}) {
    SnackbarUtils.showError();
    this.setState(this.state.setIn(['nodes', cluster.get('url'), node.getIn(['metadata', 'uid']), 'spec', 'unschedulable'], schedulable));
  }

}

export default alt.createStore(immutableUtil(NodesStore), 'NodesStore');
