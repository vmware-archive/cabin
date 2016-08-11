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

const {
  View,
  Image,
  StyleSheet,
} = ReactNative;

const { PropTypes } = React;
const iconPod = require('images/cube.png');
const iconService = require('images/tool.png');
const iconReplication = require('images/duplicate.png');
const iconNodes = require('images/connection.png');
const iconObjects = require('images/shape.png');
const iconLock = require('images/lock.png');
const iconDisk = require('images/disk.png');
const iconAccount = require('images/account.png');

const styles = StyleSheet.create({
  container: {
    width: 30, height: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 15, height: 15,
    tintColor: Colors.WHITE,
  },
});

export default class EntityIcon extends Component {

  static propTypes = {
    type: PropTypes.string.isRequired,
    status: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }

  render() {
    const { type } = this.props;
    let { status } = this.props;
    if (typeof status === 'object' && status.get('phase')) {
      status = status.get('phase').toUpperCase();
    }
    return (
      <View style={[styles.container, {backgroundColor: this.colorForType({type, status})}]}>
        <Image style={styles.icon} source={this.iconForType(type)}/>
      </View>
    );
  }

  colorForType({type, status}) {
    switch (type) {
      case 'pods':
        if (status === Constants.Status.RUNNING) { return Colors.GREEN; }
        if (status === Constants.Status.DOWN) { return Colors.RED; }
        if (status === Constants.Status.PENDING) { return Colors.GRAY; }
        return Colors.GREEN;
      case 'services':
        return Colors.ORANGE;
      case 'replicationcontrollers':
        return Colors.PURPLE;
      case 'deployments':
        return Colors.PURPLE;
      case 'nodes':
        return Colors.BLUE;
      case 'secrets':
        return Colors.BLUE2;
      case 'serviceaccounts':
        return Colors.TURQUOISE;
      case 'persistentvolumes':
      case 'persistentvolumeclaims':
        return Colors.PINK;
      case 'ingresses':
        return Colors.GREEN2;
      case 'replicasets':
        return Colors.YELLOW2;
      default:
        return Colors.BLUE;
    }
  }

  iconForType(type) {
    switch (type) {
      case 'pods':
        return iconPod;
      case 'services':
        return iconService;
      case 'replicationcontrollers':
        return iconReplication;
      case 'deployments':
        return iconReplication;
      case 'nodes':
        return iconNodes;
      case 'secrets':
        return iconLock;
      case 'serviceaccounts':
        return iconAccount;
      case 'persistentvolumes':
      case 'persistentvolumeclaims':
        return iconDisk;
      case 'ingresses':
        return iconObjects;
      case 'replicasets':
        return iconReplication;
      default:
        return iconObjects;
    }
  }

}
