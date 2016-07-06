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
import EndpointsActions from 'actions/EndpointsActions';
import NavigationActions from 'actions/NavigationActions';

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
    borderBottomWidth: 1,
  },
});

export default class EndpointsNew extends Component {

  constructor() {
    super();
    this.state = {
      url: '',
      name: '',
      username: '',
      password: '',
    };
  }

  componentDidMount() {
    this.submitListener = DeviceEventEmitter.addListener('EndpointsNew:submit', this.onSubmit.bind(this));
  }

  componentWillUnmount() {
    this.submitListener.remove();
  }

  render() {
    return (
      <View style={styles.flex}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <ListItem renderTitle={() => {
            return <TextInput style={{flex: 1}} placeholder="URL" onChangeText={url => this.setState({url})}/>;
          }}/>
          <ListItem renderTitle={() => {
            return <TextInput style={{flex: 1}} placeholder="Optional name" onChangeText={name => this.setState({name})}/>;
          }}/>
          <ListItem renderTitle={() => {
            return <TextInput style={{flex: 1}} placeholder="Username" onChangeText={username => this.setState({username})}/>;
          }}/>
          <ListItem renderTitle={() => {
            return <TextInput style={{flex: 1}} placeholder="Password" onChangeText={password => this.setState({password})}/>;
          }} showSeparator={false}/>
        </ScrollView>
      </View>
    );
  }

  onSubmit() {
    EndpointsActions.addEndpoint({...this.state});
    NavigationActions.popRoute();
  }

}
