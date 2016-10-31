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
import HeaderPicker from 'components/commons/HeaderPicker';
import CollectionView from 'components/commons/CollectionView';

const { PropTypes } = React;

const {
  View,
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  list: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  listContent: {
    marginTop: 20,
  },
});

export default class ClustersNewGoogle extends Component {

  static propTypes = {
    projects: PropTypes.instanceOf(Immutable.List),
  }

  constructor() {
    super();
    this.state = {
      selectedProjectIndex: 0,
    };
  }

  render() {
    const choices = this.props.projects.map(p => p.get('name'));
    return (
      <View style={styles.flex}>
        <HeaderPicker
          prefix={'Project: '}
          choices={choices}
          selectedIndex={this.state.selectedProjectIndex}
          onChange={(index) => {
            this.setState({selectedProjectIndex: index});
          }}/>
        <CollectionView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          list={this.props.projects}
          renderRow={this.renderItem.bind(this)}
        />
      </View>
    );
  }

  renderItem(project, section, row) {
    return (
      <ListItem title={`Cluster #${row}`}
        showArrow={true}
        isLast={row >= this.props.projects.size - 1} />
    );
  }

}
