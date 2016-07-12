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
import Settings from 'components/Settings';
import SettingsEntities from 'components/SettingsEntities';
import AltContainer from 'alt-container';

export default {
  getSettingsIndexRoute() {
    return {
      name: 'SettingsIndex',
      statusBarStyle: 'light-content',
      getTitle: () => 'Settings',
      renderScene(navigator) {
        return <Settings navigator={navigator} />;
      },
    };
  },

  getSettingsEntitiesRoute() {
    return {
      name: 'SettingsEntities',
      statusBarStyle: 'light-content',
      getTitle: () => 'Object kind list',
      renderScene(navigator) {
        return (
          <AltContainer store={alt.stores.SettingsStore}>
            <SettingsEntities navigator={navigator} />
          </AltContainer>
        );
      },
    };
  },
};
