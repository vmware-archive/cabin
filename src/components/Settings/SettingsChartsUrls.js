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
  TextInput,
  StyleSheet,
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

export default class SettingsChartsUrls extends Component {

  static propTypes = {
    chartsUrls: PropTypes.instanceOf(Immutable.List).isRequired,
  }

  render() {
    const { chartsUrls } = this.props;
    const urls = chartsUrls.map((url, i) => {
      return (
        <ListItem
          key={i}
          title={url}
          style={styles.item}
          onDelete={() => {
            SettingsActions.removeChartsUrl(url);
          }}
        />
      );
    });
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <ListHeader title="" />
        {urls}
        <ListItem isLast={true} renderTitle={() => {
          return (
            <TextInput
              ref={e => { this.input = e; }}
              style={styles.input}
              placeholder="Add new repo url"
              clearButtonMode="while-editing"
              onSubmitEditing={e => {
                SettingsActions.addChartsUrl(e.nativeEvent.text);
                this.input.setNativeProps({text: ''});
              }}
            />
          );
        }}
        />
      </ScrollView>
    );
  }
}
