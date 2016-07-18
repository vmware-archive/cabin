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

class ReplicationsActions {

  constructor() {
    this.generateActions(
      'fetchReplicationsStart',
      'fetchReplicationsSuccess',
      'fetchReplicationsFailure',
      'deleteReplicationStart',
      'deleteReplicationSuccess',
      'deleteReplicationFailure',
      'addReplicationLabelStart',
      'addReplicationLabelSuccess',
      'addReplicationLabelFailure',
      'deleteReplicationLabelStart',
      'deleteReplicationLabelSuccess',
      'deleteReplicationLabelFailure',
    );
  }

  fetchReplications(cluster) {
    this.fetchReplicationsStart(cluster);
    return ClustersApi.fetchReplications(cluster).then(replications => {
      this.fetchReplicationsSuccess({cluster, replications});
    })
    .catch(() => {
      this.fetchReplicationsFailure(cluster);
    });
  }

  deleteReplication({cluster, replication}) {
    this.deleteReplicationStart({cluster, replication});
    return ClustersApi.deleteReplication({cluster, replication}).then(() => {
      this.deleteReplicationSuccess({cluster, replication});
    }).catch(() => {
      this.deleteReplicationFailure({cluster, replication});
    });
  }

  addReplicationLabel({cluster, replication, key, value}) {
    this.addReplicationLabelStart({cluster, replication, key, value});
    return ClustersApi.addReplicationLabel({cluster, replication, key, value}).then(() => {
      this.addReplicationLabelSuccess({cluster, replication, key, value});
    }).catch(() => {
      this.addReplicationLabelFailure({cluster, replication, key, value});
    });
  }

  deleteReplicationLabel({cluster, replication, key}) {
    this.deleteReplicationLabelStart({cluster, replication, key});
    return ClustersApi.deleteReplicationLabel({cluster, replication, key}).then(() => {
      this.deleteReplicationLabelSuccess({cluster, replication, key});
    }).catch(() => {
      this.deleteReplicationLabelFailure({cluster, replication, key});
    });
  }
}

export default alt.createActions(ReplicationsActions);
