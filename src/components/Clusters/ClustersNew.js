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
import ListItem from 'components/commons/ListItem';
import ClustersActions from 'actions/ClustersActions';
import NavigationActions from 'actions/NavigationActions';
import { PropTypes } from 'react';

const {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  DeviceEventEmitter,
} = ReactNative;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  scrollViewContent: {
    marginTop: 40,
    borderColor: Colors.BORDER,
    borderTopWidth: 1,
  },
});

export default class ClustersNew extends Component {

  static propTypes = {
    cluster: PropTypes.instanceOf(Immutable.Map), // if provided, it will edit cluster instead of create new one
  }

  constructor(props) {
    super(props);
    const { cluster } = props;
    if (cluster) {
      this.state = cluster.toJS();
    } else {
      this.state = {
        url: '',
        name: '',
        username: '',
        password: '',
      };
    }
  }

  componentDidMount() {
    this.submitListener = DeviceEventEmitter.addListener('ClustersNew:submit', this.onSubmit.bind(this));
  }

  componentWillUnmount() {
    this.submitListener.remove();
  }

  render() {
    return (
      <View style={styles.flex}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <ListItem renderTitle={() => {
            return <TextInput style={{flex: 1}} defaultValue={this.state.url} placeholder="URL" onChangeText={url => this.setState({url})}/>;
          }}/>
          <ListItem renderTitle={() => {
            return <TextInput style={{flex: 1}} defaultValue={this.state.name} placeholder="Optional name" onChangeText={name => this.setState({name})}/>;
          }}/>
          <ListItem renderTitle={() => {
            return <TextInput style={{flex: 1}} defaultValue={this.state.username} placeholder="Username" onChangeText={username => this.setState({username})}/>;
          }}/>
          <ListItem renderTitle={() => {
            return <TextInput style={{flex: 1}} defaultValue={this.state.password} placeholder="Password" onChangeText={password => this.setState({password})}/>;
          }} lastItem={true}/>
        </ScrollView>
      </View>
    );
  }

  onSubmit() {
    if (this.props.cluster) {
      ClustersActions.editCluster({cluster: this.props.cluster, params: {...this.state}});
    } else {
      ClustersActions.addCluster({...this.state});
    }
    NavigationActions.popRoute();
  }

}
