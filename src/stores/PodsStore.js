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
import PodsActions from 'actions/PodsActions';
import Immutable from 'immutable';
import altImmutable from 'alt-utils/lib/ImmutableUtil';
import ImmutableUtils from 'utils/ImmutableUtils';
import FakeData from './FakeData';

class PodsStore {

  constructor() {
    this.bindActions(InitActions);
    this.bindActions(PodsActions);
    if (__DEV__ && FakeData.get(this.displayName)) {
      this.state = FakeData.get(this.displayName);
    } else {
      this.state = Immutable.fromJS({
        pods: {},
        logs: {},
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

  onFetchPodsStart(cluster) {
    this.setState(this.state.setIn(['status', cluster.get('url')], 'loading'));
  }

  onFetchPodsSuccess({cluster, pods}) {
    this.setState(
      this.state.setIn(['pods', cluster.get('url')],
        ImmutableUtils.entitiesToMap(pods.map(e => e.set('kind', 'pods'))))
      .setIn(['status', cluster.get('url')], 'success')
    );
  }

  onFetchPodLogsSuccess({cluster, pod, logs}) {
    this.setState(this.state.setIn(['logs', cluster.get('url'), pod.getIn(['metadata', 'name'])], logs));
  }

  onFetchPodsFailure(cluster) {
    const pods = alt.stores.PodsStore.getPods(cluster);
    this.setState(this.state.setIn(['status', cluster.get('url')], pods.size === 0 ? 'failure' : 'success'));
  }

  onDeletePodStart({cluster, pod}) {
    this.setState(this.state.deleteIn(['pods', cluster.get('url'), pod.getIn(['metadata', 'name'])]));
  }

  onAddPodLabelStart({cluster, pod, key, value}) {
    this.setState(this.state.setIn(['pods', cluster.get('url'), pod.getIn(['metadata', 'name']), 'metadata', 'labels', key], value));
  }

  onAddPodLabelFailure({cluster, pod, key}) {
    this.setState(this.state.removeIn(['pods', cluster.get('url'), pod.getIn(['metadata', 'name']), 'metadata', 'labels', key]));
  }

  onDeletePodLabelStart({cluster, pod, key}) {
    this.setState(this.state.removeIn(['pods', cluster.get('url'), pod.getIn(['metadata', 'name']), 'metadata', 'labels', key]));
  }

  static getStatus(cluster) {
    return this.state.getIn(['status', cluster.get('url')], 'success');
  }

  static getPods(cluster) {
    return this.state.getIn(['pods', cluster.get('url')], Immutable.List()).toList();
  }

  static getLogs({cluster, pod}) {
    return this.state.getIn(['logs', cluster.get('url'), pod.getIn(['metadata', 'name'])], Immutable.List());
  }

  static get({pod, cluster, podName}) {
    if (!podName) {
      podName = pod.getIn(['metadata', 'name']);
    }
    return this.state.getIn(['pods', cluster.get('url'), podName]);
  }

}

export default alt.createStore(altImmutable(PodsStore), 'PodsStore');
