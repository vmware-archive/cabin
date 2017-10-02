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
import ServicesActions from 'actions/ServicesActions';
import DeploymentsActions from 'actions/DeploymentsActions';
import NavigationActions from 'actions/NavigationActions';
import ScrollView from 'components/commons/ScrollView';
import ActionSheetUtils from 'utils/ActionSheetUtils';
import AlertUtils from 'utils/AlertUtils';

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
  description: {
    color: Colors.GRAY,
  },
  loader: {
    position: 'absolute',
    left: 0, bottom: 0, right: 0, top: 0,
  },
});

export default class ServicesNew extends Component {

  static propTypes = {
    cluster: PropTypes.instanceOf(Immutable.Map).isRequired,
    defaultDeployment: PropTypes.instanceOf(Immutable.Map),
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
      deployment: props.defaultDeployment,
      name: props.defaultDeployment ? props.defaultDeployment.getIn(['metadata', 'name']) : null,
      port: '1234',
      loading: false,
    };
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    DeploymentsActions.fetchDeployments(this.props.cluster);
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
    const { deployment } = this.state;
    let selectedDeploymentTitle = deployment ? deployment.getIn(['metadata', 'name']) : null;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps="always">
          <ListHeader title={intl('service_new_description')} style={{height: null, paddingBottom: 10}}/>
          <ListItem title={deployment ? 'Deployment' : intl('service_new_choose_deployment')} detailTitle={selectedDeploymentTitle} showArrow={true} onPress={this.selectDeployment.bind(this)}/>
          <ListInputItem ref="nameInput" autoCapitalize="none" autoCorrect={false} defaultValue={this.state.name} placeholder="Service name"
            onChangeText={name => this.setState({name})}/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} defaultValue={this.state.port} placeholder="Port"
            onChangeText={port => this.setState({port})} isLast={true}/>
        </ScrollView>
        {this.state.loading && <ActivityIndicator animating={this.state.loading} style={styles.loader}/>}
      </View>
    );
  }

  selectDeployment() {
    const deployments = alt.stores.DeploymentsStore.getAll(this.props.cluster);
    const options = [
      {title: intl('cancel')},
      ...deployments.map(deployment => {
        const name = deployment.getIn(['metadata', 'name']);
        return {
          title: name,
          onPress: () => {
            this.setState({deployment, name});
            this.refs.nameInput.setText(name);
          },
        };
      }).toJS(),
    ];
    const title = deployments.size > 0 ? intl('service_new_choose_deployment_alert') : intl('service_new_no_deployments_alert');
    ActionSheetUtils.showActionSheetWithOptions({options, title});
  }

  onSubmit() {
    if (this.state.loading || !this.state.deployment || !this.state.name) { return; }
    this.setState({loading: true});
    ServicesActions.createService({
      cluster: this.props.cluster,
      ...this.state,
    }).then(() => NavigationActions.pop())
    .catch((error) => {
      AlertUtils.showError({message: error.message});
      this.setState({loading: false});
    });
  }

}
