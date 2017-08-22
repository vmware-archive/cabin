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
const { PropTypes } = React;

const {
  View,
  Image,
  ScrollView,
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  list: {
    flex: 1,
  },
  selectedIcon: {
    tintColor: Colors.GREEN,
    height: 16,
    width: 16,
    resizeMode: 'contain',
  },
});

export default class SelectPicker extends Component {
  static propTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired,
    selectedIndex: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
  }

  render() {
    const { list, selectedIndex, onSelect } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.list} contentContainerStyle={{paddingBottom: 20}} keyboardDismissMode="interactive">
          {list.map((e, i) => {
            const isLast = i >= list.size - 1;
            return (
              <ListItem title={e} isLast={isLast}
                onPress={() => onSelect(i)}
                renderDetail={i === selectedIndex && (() => {
                  return <Image source={require('images/done.png')} style={styles.selectedIcon} />;
                })}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }
}
