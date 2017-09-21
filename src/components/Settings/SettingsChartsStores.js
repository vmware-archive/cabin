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
import AlertUtils from 'utils/AlertUtils';
import PStyleSheet from 'styles/PStyleSheet';
import ListHeader from 'components/commons/ListHeader';
import ListItem from 'components/commons/ListItem';
import ScrollView from 'components/commons/ScrollView';

import PropTypes from 'prop-types';
const {
  View,
  TextInput,
  Alert,
  ActivityIndicator,
} = ReactNative;

const styles = PStyleSheet.create({
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
    android: {
      height: 40,
    },
  },
  checking: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
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
      checking: false,
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
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.contentContainer}>
        <ListHeader title="" />
        {items}
        <ListItem isLast={true} style={[{height: null}, this.state.checking && {backgroundColor: Colors.BACKGROUND}]}
        renderTitle={() => {
          return (
            <View style={{flexDirection: 'column', paddingBottom: 10}}>
              <TextInput
                ref={e => { this.urlInput = e; }}
                style={[styles.input, this.state.checking && {opacity: 0.4}]}
                placeholder={intl('settings_repo_url_placeholder')}
                clearButtonMode="while-editing"
                autoCapitalize="none" autoCorrect={false}
                returnKeyType="done"
                enabled={!this.state.checking}
                onChangeText={text => {this.url = text;}}
                onSubmitEditing={this.handleSubmit.bind(this)}
                onFocus={() => this.setState({focused: true})}
              />
              {this.state.focused && <TextInput
                ref={e => { this.nameInput = e; }}
                style={[styles.input, this.state.checking && {opacity: 0.4}]}
                placeholder={intl('settings_repo_name_placeholder')}
                clearButtonMode="while-editing"
                autoCapitalize="none" autoCorrect={false}
                returnKeyType="done"
                enabled={!this.state.checking}
                onChangeText={text => {this.name = text;}}
                onSubmitEditing={this.handleSubmit.bind(this)}
              />}
              {this.state.checking && <ActivityIndicator style={styles.checking} color={Colors.GRAY} animating={this.state.checking}/>}
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
    this.setState({checking: true});
    SettingsActions.addChartsStore({url: this.url, name: this.name}).then(() => {
      this.urlInput.setNativeProps({text: ''});
      this.nameInput.setNativeProps({text: ''});
      this.setState({checking: false, focus: false});
    }).catch(() => {
      AlertUtils.showWarning({message: intl('settings_repo_failed')});
      this.setState({checking: false});
    });
  }
}
