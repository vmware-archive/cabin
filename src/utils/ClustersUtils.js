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
const { AlertIOS } = ReactNative;

const { Status } = Constants;

export default class ClustersUtils {

  static colorForStatus(status) {
    switch (status) {
      case Status.RUNNING:
      case Status.READY:
        return Colors.GREEN;
      case Status.DOWN:
      case Status.NOTREADY:
        return Colors.RED;
      default:
        return Colors.GRAY;
    }
  }

  static textForStatus(status) {
    switch (status) {
      case Status.RUNNING || 'Running':
        return intl('status_up');
      case Status.READY:
        return intl('status_ready');
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
        AlertIOS.prompt(
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

}
