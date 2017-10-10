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
import Colors, { defaultNavigatorStyle } from 'styles/Colors';
import ListInputItem from 'components/commons/ListInputItem';
import ListItem from 'components/commons/ListItem';
import ListHeader from 'components/commons/ListHeader';
import DeploymentsActions from 'actions/DeploymentsActions';
import ClustersActions from 'actions/ClustersActions';
import SnackbarUtils from 'utils/SnackbarUtils';
import ClustersUtils from 'utils/ClustersUtils';
import ScrollView from 'components/commons/ScrollView';

import PropTypes from 'prop-types';

const {
  View,
  ActivityIndicator,
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    marginTop: 20,
  },
  loader: {
    position: 'absolute',
    left: 0, bottom: 0, right: 0, top: 0,
  },
});

export default class DeploymentsNew extends Component {

  static propTypes = {
    cluster: PropTypes.instanceOf(Immutable.Map).isRequired,
  }

  static navigatorStyle = defaultNavigatorStyle;

  static navigatorButtons = {
    leftButtons: [{
      id: 'cancel',
      title: intl('cancel'),
    }],
    rightButtons: [{
      id: 'done',
      title: intl('done'),
    }],
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      image: '',
      namespace: props.cluster.get('currentNamespace') || 'default',
      loading: false,
    };
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'cancel':
        this.props.navigator.dismissModal();
        break;
      case 'done':
        this.onSubmit();
        break;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps="always">
          <ListHeader title=""/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} defaultValue={this.state.name} placeholder="Optional name"
          onChangeText={name => this.setState({name})}/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} defaultValue={this.state.image} placeholder="Image"
            onChangeText={image => this.setState({image})}/>
          <ListItem title={intl('namespace')}
            detailTitle={this.state.namespace}
            onPress={this.switchNamespace.bind(this)}
            showArrow={true} isLast={true}/>
        </ScrollView>
        {this.state.loading && <ActivityIndicator animating={this.state.loading} style={styles.loader}/>}
      </View>
    );
  }

  switchNamespace() {
    ClustersActions.fetchNamespaces(this.props.cluster);
    ClustersUtils.showNamespaceActionSheet({cluster: this.props.cluster, all: false, create: true}).then(namespace => {
      this.setState({namespace});
    });
  }

  onSubmit() {
    if (this.state.loading) { return; }
    if (!this.state.image) {
      SnackbarUtils.showWarning({title: intl('deployment_new_empty_image')});
      return;
    }
    this.setState({loading: true});
    DeploymentsActions.createDeployment({
      cluster: this.props.cluster,
      name: (this.state.name || this.state.image).toLowerCase().replace(/[^a-z0-9.]/g, '-'),
      image: this.state.image,
      namespace: this.state.namespace,
    })
    .then(() => this.props.navigator.dismissModal())
    .catch(e => SnackbarUtils.showError({title: e.message}))
    .finally(() => this.setState({loading: false}));
  }

}
