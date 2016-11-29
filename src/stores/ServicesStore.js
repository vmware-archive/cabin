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
import ServicesActions from 'actions/ServicesActions';
import immutableUtil from 'alt-utils/lib/ImmutableUtil';
import BaseEntitiesStore from './BaseEntitiesStore';

const entityType = 'services';

class ServicesStore extends BaseEntitiesStore {

  constructor() {
    super({entityType, persistent: true});
    this.bindActions(ServicesActions);
  }

  onUpdateServiceTypeStart({cluster, service, type}) {
    this.setState(this.state.setIn(['services', cluster.get('url'), service.getIn(['metadata', 'uid']), 'spec', 'type'], type));
  }

  onUpdateServiceTypeSuccess({cluster, service}) {
    this.setState(this.state.mergeIn(['services', cluster.get('url'), service.getIn(['metadata', 'uid'])], service.set('kind', entityType)));
  }

  onUpdateServicePortsSuccess({cluster, service}) {
    this.setState(this.state.setIn(['services', cluster.get('url'), service.getIn(['metadata', 'uid'])], service.set('kind', entityType)));
  }

}

export default alt.createStore(immutableUtil(ServicesStore), 'ServicesStore');
