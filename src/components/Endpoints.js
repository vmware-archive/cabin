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
import CollectionView from 'components/commons/CollectionView';
import EndpointsRoutes from 'routes/EndpointsRoutes';
import Colors from 'styles/Colors';
import ListItem from 'components/commons/ListItem';
import AltContainer from 'alt-container';
import EndpointsActions from 'actions/EndpointsActions';
import NodesActions from 'actions/NodesActions';

const {
  View,
  StyleSheet,
  Alert,
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
    marginTop: 40,
    borderColor: Colors.BORDER,
    borderBottomWidth: 1,
  },
});

export default class Endpoints extends Component {

  render() {
    return (
      <View style={styles.flex}>
        <AltContainer stores={{
          list: () => {
            return {
              store: alt.stores.EndpointsStore,
              value: alt.stores.EndpointsStore.getEndpoints(),
            };
          }}}>
          <CollectionView style={styles.list}
            contentInset={{bottom: 40}}
            scrollIndicatorInsets={{bottom: 0}}
            contentContainerStyle={styles.listContent}
            list={alt.stores.EndpointsStore.getEndpoints()}
            renderRow={this.renderRow.bind(this)}
          />
        </AltContainer>
      </View>
    );
  }

  renderRow(endpoint, rowID, index) {
    const list = alt.stores.EndpointsStore.getEndpoints();
    const isLast = index < list.size - 1;
    return (
      <ListItem
        title={endpoint.get('name')}
        showSeparator={isLast}
        showArrow={true}
        onPress={() => this.onPressItem(endpoint)}
        onLongPress={() => this.onLongPressItem(endpoint)}
      />
    );
  }

  onPressItem(endpoint) {
    NodesActions.fetchNodes(endpoint);
    this.props.navigator.push(EndpointsRoutes.getEndpointShowRoute(endpoint));
  }

  onLongPressItem(endpoint) {
    Alert.alert(
      intl('endpoint_remove_title'),
      intl('endpoint_remove_subtitle'),
      [
        {text: intl('cancel'), style: 'cancel', onPress: () => {}},
        {text: intl('yes'), onPress: () => {
          EndpointsActions.removeEndpoint(endpoint);
        }},
      ],
    );
  }
}
