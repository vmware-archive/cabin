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
import SettingsActions from 'actions/SettingsActions';
import ListHeader from 'components/commons/ListHeader';
import ListItem from 'components/commons/ListItem';
import ScrollView from 'components/commons/ScrollView';

const { PropTypes } = React;
const {
  View,
  TextInput,
  StyleSheet,
  Alert,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BACKGROUND,
  },
  contentContainer: {
    paddingTop: 20,
  },
  item: {
    height: null,
    paddingVertical: 12,
  },
  input: {
    marginTop: 10,
    height: 30,
  },
});

export default class SettingsChartsStores extends Component {

  static propTypes = {
    chartsStores: PropTypes.instanceOf(Immutable.List).isRequired,
  }

  constructor() {
    super();
    this.state = {
      focused: false,
    };
  }

  render() {
    const { chartsStores } = this.props;
    const items = chartsStores.map((store, i) => {
      return (
        <ListItem
          key={i}
          title={store.get('name')}
          subtitle={store.get('url')}
          style={styles.item}
          onDelete={i === 0 ? undefined : () => {
            SettingsActions.removeChartsStore(store.get('url'));
          }}
        />
      );
    });
    return (
      <ScrollView style={styles.container}
        keyboardDismissMode={'interactive'}
        keyboardShouldPersistTaps={true}
        contentContainerStyle={styles.contentContainer}>
        <ListHeader title="" />
        {items}
        <ListItem isLast={true} style={{height: null}} renderTitle={() => {
          return (
            <View style={{flexDirection: 'column', paddingBottom: 10}}>
              <TextInput
                ref={e => { this.urlInput = e; }}
                style={styles.input}
                placeholder={intl('settings_repo_url_placeholder')}
                clearButtonMode="while-editing"
                autoCapitalize="none" autoCorrect={false}
                returnKeyType="done"
                onChangeText={text => {this.url = text;}}
                onSubmitEditing={this.handleSubmit.bind(this)}
                onFocus={() => this.setState({focused: true})}
              />
              {this.state.focused && <TextInput
                ref={e => { this.nameInput = e; }}
                style={styles.input}
                placeholder={intl('settings_repo_name_placeholder')}
                clearButtonMode="while-editing"
                autoCapitalize="none" autoCorrect={false}
                returnKeyType="done"
                onChangeText={text => {this.name = text;}}
                onSubmitEditing={this.handleSubmit.bind(this)}
              />}
            </View>
          );
        }}
        />
      </ScrollView>
    );
  }

  handleSubmit() {
    if (!this.url || !this.name) {
      Alert.alert(intl('settings_repo_add_alert'));
      return;
    }
    SettingsActions.addChartsStore({url: this.url, name: this.name});
    this.urlInput.setNativeProps({text: ''});
    this.nameInput.setNativeProps({text: ''});
  }
}
