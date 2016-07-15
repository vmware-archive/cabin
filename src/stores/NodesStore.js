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
import NodesActions from 'actions/NodesActions';
import Immutable from 'immutable';
import immutableUtil from 'alt-utils/lib/ImmutableUtil';
import FakeData from './FakeData';

class NodesStore {

  constructor() {
    this.bindActions(InitActions);
    this.bindActions(NodesActions);
    if (__DEV__ && FakeData.get(this.displayName)) {
      this.state = FakeData.get(this.displayName);
    } else {
      this.state = Immutable.fromJS({
        nodes: {},
        status: {},
      });
    }
  }

  onInitAppSuccess(appState) {
    if (appState.get(this.displayName)) {
      this.setState(this.state.mergeDeep(appState.get(this.displayName)));
      return true;
    }
    return false;
  }

  onFetchNodesStart(cluster) {
    this.setState(this.state.setIn(['status', cluster.get('url')], 'loading'));
  }

  onFetchNodesSuccess({cluster, nodes}) {
    this.setState(
      this.state.setIn(['nodes', cluster.get('url')], nodes.map(e => e.set('type', 'nodes')))
      .setIn(['status', cluster.get('url')], 'success')
    );
  }

  onFetchNodesFailure(cluster) {
    const nodes = alt.stores.NodesStore.getNodes(cluster);
    this.setState(this.state.setIn(['status', cluster.get('url')], nodes.size === 0 ? 'failure' : 'success'));
  }

  onDeleteNodeStart({cluster, node}) {
    this.setState(this.state.updateIn(['nodes', cluster.get('url')], nodes => {
      return nodes.filter(p => p.getIn(['metadata', 'name']) !== node.getIn(['metadata', 'name']));
    }));
  }

  onAddNodeLabelStart({cluster, node, key, value}) {
    const index = this.state.getIn(['nodes', cluster.get('url')]).findIndex(e => {
      return e.getIn(['metadata', 'name']) === node.getIn(['metadata', 'name']);
    });
    this.setState(this.state.setIn(['nodes', cluster.get('url'), index, 'metadata', 'labels', key], value));
  }

  onAddNodeLabelFailure({cluster, node, key}) {
    const index = this.state.getIn(['nodes', cluster.get('url')]).findIndex(e => {
      return e.getIn(['metadata', 'name']) === node.getIn(['metadata', 'name']);
    });
    this.setState(this.state.removeIn(['nodes', cluster.get('url'), index, 'metadata', 'labels', key]));
  }

  onDeleteNodeLabelStart({cluster, node, key}) {
    const index = this.state.getIn(['nodes', cluster.get('url')]).findIndex(e => {
      return e.getIn(['metadata', 'name']) === node.getIn(['metadata', 'name']);
    });
    this.setState(this.state.removeIn(['nodes', cluster.get('url'), index, 'metadata', 'labels', key]));
  }

  static getStatus(cluster) {
    return this.state.getIn(['status', cluster.get('url')], 'success');
  }

  static getNodes(cluster) {
    return this.state.getIn(['nodes', cluster.get('url')], Immutable.List());
  }

  static get({nodeName, cluster}) {
    return this.state.getIn(['nodes', cluster.get('url')]).find(e => {
      return e.getIn(['metadata', 'name']) === nodeName;
    });
  }

}

export default alt.createStore(immutableUtil(NodesStore), 'NodesStore');
