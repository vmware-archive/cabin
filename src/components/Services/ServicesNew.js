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
import ListInputItem from 'components/commons/ListInputItem';
import ListItem from 'components/commons/ListItem';
import ListHeader from 'components/commons/ListHeader';
import ServicesActions from 'actions/ServicesActions';
import NavigationActions from 'actions/NavigationActions';
import ScrollView from 'components/commons/ScrollView';
import ActionSheetUtils from 'utils/ActionSheetUtils';
import AlertUtils from 'utils/AlertUtils';

const { PropTypes } = React;

const {
  View,
  ActivityIndicator,
  StyleSheet,
  DeviceEventEmitter,
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
    defaultDeployment: PropTypes.instanceOf(Immutable.Map).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      deployment: props.defaultDeployment,
      name: props.defaultDeployment.getIn(['metadata', 'name']),
      port: '1234',
      loading: false,
    };
  }

  componentDidMount() {
    this.submitListener = DeviceEventEmitter.addListener('ServicesNew:submit', this.onSubmit.bind(this));
  }

  componentWillUnmount() {
    this.submitListener.remove();
  }

  render() {
    const { deployment } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps={true}>
          <ListHeader title={intl('service_new_description')} style={{height: null, paddingBottom: 10}}/>
          <ListItem title="Deployment" detailTitle={deployment.getIn(['metadata', 'name'])} showArrow={true} onPress={this.selectDeployment.bind(this)}/>
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
    ActionSheetUtils.showActionSheetWithOptions({options, title: 'Choose a deployment to expose'});
  }

  onSubmit() {
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
