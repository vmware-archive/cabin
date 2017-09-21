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
import SearchBar from 'components/SearchBar';

import PropTypes from 'prop-types';
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
  searchContainer: {
    paddingBottom: 8,
    paddingHorizontal: 8,
    backgroundColor: Colors.BLUE,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  search: {
    width: 'auto',
    flex: 1,
    marginLeft: 0,
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
    selectedId: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
  }

  state = {
    searchValue: '',
  }

  render() {
    const { list, selectedId, onSelect } = this.props;
    const { searchValue } = this.state;
    let filteredList = list;
    if (searchValue) {
      filteredList = list.filter(e => {
        return e.name.toLowerCase().indexOf(searchValue) !== -1 || e.id.toLowerCase().indexOf(searchValue) !== -1;
      });
    }
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchBar
            style={styles.search}
            placeholder="Search"
            onChange={text => this.setState({ searchValue: text.toLowerCase() })}
          />
        </View>
        <ScrollView style={styles.list} contentContainerStyle={{paddingBottom: 20}} keyboardDismissMode="interactive">
          {filteredList.map((e, i) => {
            const isLast = i >= filteredList.size - 1;
            const selected = e.id === selectedId;
            return (
              <ListItem key={e.id} title={e.name} isLast={isLast}
                onPress={() => onSelect(e)}
                renderDetail={selected && (() => {
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
