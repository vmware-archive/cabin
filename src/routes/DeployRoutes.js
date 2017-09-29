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
import DeployClusters from 'components/Deploy/DeployClusters';
import DeployReleasesShow from 'components/Deploy/DeployReleasesShow';
import AltContainer from 'alt-container';

export default {

  getDeployReleasesShowRoute({cluster, release}) {
    return {
      name: 'DeployReleasesShow',
      statusBarStyle: 'light-content',
      getTitle: () => release.get('name'),
      getBackButtonTitle: () => '',
      renderScene(navigator) {
        return (
          <DeployReleasesShow cluster={cluster} release={release} navigator={navigator} />
        );
      },
    };
  },

  getDeployClustersRoute(chart) {
    return {
      name: 'DeployClusters',
      statusBarStyle: 'light-content',
      getTitle: () => intl('deploy_choose_cluster'),
      getBackButtonTitle: () => intl('deploy_choose_cluster_back'),
      renderScene(navigator) {
        return (
          <AltContainer stores={{
            clusters: () => {
              return {
                store: alt.stores.ClustersStore,
                value: alt.stores.ClustersStore.getClusters(),
              };
            }}}>
            <DeployClusters chart={chart} clusters={alt.stores.ClustersStore.getClusters()} navigator={navigator} />
          </AltContainer>
        );
      },
    };
  },
};
