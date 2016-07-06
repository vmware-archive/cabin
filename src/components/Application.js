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
import Navigator from 'components/commons/Navigator';
import TabBar from 'components/commons/TabBar';
import InitActions from 'actions/InitActions';

export default class Application extends Component {

  componentDidMount() {
    InitActions.initializeApplication();
  }

  render() {
    return (
      <Navigator
        navigatorEvent="application:navigation"
        showNavigationBar={false}
        sceneStyle={{paddingTop: 0}}
        initialRoute={{
          statusBarStyle: 'light-content',
          renderScene() {
            return <TabBar />;
          },
        }}
      />
    );
  }
}
