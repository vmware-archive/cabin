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
import ClustersActions from 'actions/ClustersActions';
import AlertUtils from 'utils/AlertUtils';

const { PropTypes } = React;
const {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  AlertIOS,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BLUE,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    flexDirection: 'row',
  },
  text: {
    color: Colors.WHITE,
  },
  namespaceText: {
    fontWeight: '700',
  },
  arrow: {
    tintColor: Colors.WHITE,
    width: 10, height: 10,
    marginLeft: 4,
    resizeMode: 'contain',
  },
});

export default class NamespacePicker extends Component {

  static propTypes = {
    cluster: PropTypes.instanceOf(Immutable.Map),
  }

  render() {
    const namespaceTitle = this.props.cluster.get('currentNamespace') || intl('namespaces_all');
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.innerContainer} onPress={this.handlePress.bind(this)}>
          <Text style={styles.text}>
            Namespace:
            <Text style={styles.namespaceText}> {namespaceTitle}</Text>
          </Text>
          <Image source={require('images/arrow-down.png')} style={styles.arrow}/>
        </TouchableOpacity>
      </View>
    );
  }

  handlePress() {
    const namespaces = this.props.cluster.get('namespaces', Immutable.List());
    const onPress = (index) => {
      let namespace;
      if (index > 1) {
        namespace = namespaces.get(index - 2);
      }
      if (namespace !== this.props.cluster.get('currentNamespace')) {
        this.switchNamespace(namespace);
      }
    };
    const options = [
      { title: intl('cancel') }, { title: intl('namespaces_all'), onPress},
      ...namespaces.map(n => { return {title: n, onPress};}),
      { title: intl('namespaces_create'), destructive: true, onPress: this.handleCreateNamespace.bind(this)},
    ];
    ActionSheetUtils.showActionSheetWithOptions({options});
  }

  handleCreateNamespace() {
    AlertIOS.prompt(
      intl('namespaces_create'),
      null,
      [{text: intl('cancel')},
        {text: intl('create'), onPress: text => {
          ClustersActions.createNamespace({cluster: this.props.cluster, namespace: text})
          .then(() => this.switchNamespace(text))
          .catch(e => AlertUtils.showError({message: e.message}));
        }},
      ]
    );
  }

  switchNamespace(namespace) {
    ClustersActions.setCurrentNamespace({cluster: this.props.cluster, namespace});
    setTimeout(() => {
      const cluster = alt.stores.ClustersStore.get(this.props.cluster.get('url'));
      cluster && ClustersActions.fetchClusterEntities(cluster);
    }, 500);
  }

}
