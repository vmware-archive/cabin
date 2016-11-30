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
import Colors from 'styles/Colors';
import ActionSheetUtils from 'utils/ActionSheetUtils';
import AlertUtils from 'utils/AlertUtils';
import ClustersActions from 'actions/ClustersActions';
import Alert from 'utils/Alert';

export default class ClustersUtils {

  static colorForStatus(status) {
    const { Status } = Constants;
    switch (status) {
      case Status.RUNNING:
      case Status.READY:
      case Status.READY_UNSCHEDULABLE:
        return Colors.GREEN;
      case Status.DOWN:
      case Status.NOTREADY:
        return Colors.RED;
      default:
        return Colors.GRAY;
    }
  }

  static textForStatus(status) {
    const { Status } = Constants;
    switch (status) {
      case Status.RUNNING || 'Running':
        return intl('status_up');
      case Status.READY:
        return intl('status_ready');
      case Status.READY_UNSCHEDULABLE:
        return intl('status_ready_unschedulable');
      case Status.NOTREADY:
        return intl('status_notready');
      case Status.DOWN:
        return intl('status_down');
      case Status.PENDING:
        return intl('status_pending');
      case Status.TERMINATING:
        return intl('status_terminating');
      case Status.CONTAINERCREATING:
        return intl('status_creating');
      default:
        return intl('status_checking');
    }
  }

  static showNamespaceActionSheet({cluster, all = true, create = false}) {
    return new Promise(resolve => {
      const handleCreateNamespace = () => {
        Alert.prompt(
          intl('namespaces_create'),
          null,
          [{text: intl('cancel')},
          {text: intl('create'), onPress: text => {
            ClustersActions.createNamespace({cluster, namespace: text})
            .then(() => resolve(text))
            .catch(e => AlertUtils.showError({message: e.message}));
          }},
          ]
        );
      };
      const namespaces = alt.stores.ClustersStore.get(cluster.get('url')).get('namespaces', Immutable.List());
      const onPress = (index) => {
        let namespace;
        if (!all || index > 1) { namespace = namespaces.get(index - (all ? 2 : 1)); } // 1 == all namespaces
        resolve(namespace);
      };
      const options = [{ title: intl('cancel') }];
      all && options.push({ title: intl('namespaces_all'), onPress});
      options.push(...namespaces.map(n => { return {title: n, onPress};}));
      create && options.push({ title: intl('namespaces_create'), destructive: true, onPress: handleCreateNamespace});
      ActionSheetUtils.showActionSheetWithOptions({options});
    });
  }

  static hasSpartakusDeployment(cluster) {
    const spartakus = alt.stores.DeploymentsStore.getAll(cluster)
      .find(d => d.getIn(['metadata', 'name']) === 'spartakus');
    return spartakus ? true : false;
  }

  static nodeUrlForCluster(cluster) {
    const nodes = alt.stores.NodesStore.getAll(cluster);
    const readyNodes = nodes.filter(node => {
      return node.getIn(['status', 'conditions']).find(c => c.get('type') === 'Ready').get('status') === 'True';
    });
    let url;
    const ready = readyNodes.find(node => {
      const externalID = node.getIn(['spec', 'externalID']);
      if (/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(externalID)) {
        url = externalID;
        return true;
      }
      const ExternalIP = node.getIn(['status', 'addresses']).find(addr => addr.get('type') === 'ExternalIP');
      const InternalIP = node.getIn(['status', 'addresses']).find(addr => addr.get('type') === 'InternalIP');
      const address = ExternalIP || InternalIP;
      if (address) {
        url = address.get('address');
        return true;
      }
      return false;
    });
    return ready ? url : false;
  }

  static hostForCluster({cluster, service}) {
    let url = ClustersUtils.nodeUrlForCluster(cluster);
    if (!url) {
      url = cluster.get('url').split(':')[0];
    }
    return `${url}:${service.getIn(['spec', 'ports', 0, 'nodePort'])}`;
  }

}
