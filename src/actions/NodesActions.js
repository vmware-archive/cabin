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
import ClustersApi from 'api/ClustersApi';

class NodesActions {

  constructor() {
    this.generateActions(
      'fetchNodesStart',
      'fetchNodesSuccess',
      'fetchNodesFailure',
      'deleteNodeStart',
      'deleteNodeSuccess',
      'deleteNodeFailure',
      'addNodeLabelStart',
      'addNodeLabelSuccess',
      'addNodeLabelFailure',
      'deleteNodeLabelStart',
      'deleteNodeLabelSuccess',
      'deleteNodeLabelFailure',
    );
  }

  fetchNodes(cluster) {
    this.fetchNodesStart(cluster);
    return ClustersApi.fetchNodes(cluster).then(nodes => {
      this.fetchNodesSuccess({cluster, nodes});
    })
    .catch(() => {
      this.fetchNodesFailure(cluster);
    });
  }

  deleteNode({cluster, node}) {
    this.deleteNodeStart({cluster, node});
    return ClustersApi.deleteNode({cluster, node}).then(() => {
      this.deleteNodeSuccess({cluster, node});
    }).catch(() => {
      this.deleteNodeFailure({cluster, node});
    });
  }

  addNodeLabel({cluster, node, key, value}) {
    this.addNodeLabelStart({cluster, node, key, value});
    return ClustersApi.addNodeLabel({cluster, node, key, value}).then(() => {
      this.addNodeLabelSuccess({cluster, node, key, value});
    }).catch(() => {
      this.addNodeLabelFailure({cluster, node, key, value});
    });
  }

  deleteNodeLabel({cluster, node, key}) {
    this.deleteNodeLabelStart({cluster, node, key});
    return ClustersApi.deleteNodeLabel({cluster, node, key}).then(() => {
      this.deleteNodeLabelSuccess({cluster, node, key});
    }).catch(() => {
      this.deleteNodeLabelFailure({cluster, node, key});
    });
  }
}

export default alt.createActions(NodesActions);
