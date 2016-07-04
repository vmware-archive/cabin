import CollectionView from 'components/commons/CollectionView';
import NodesRoutes from 'routes/NodesRoutes';
import Colors from 'styles/Colors';
import ListItem from 'components/commons/ListItem';

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
    marginTop: 40,
    borderColor: Colors.BORDER,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
});

export default class Endpoints extends Component {

  constructor() {
    super();
    this.state = {
      endpoints: Immutable.fromJS([
      ]),
    };
  }


  render() {
    return (
      <View style={styles.flex}>
        <CollectionView style={styles.list}
          contentInset={{bottom: 40}}
          scrollIndicatorInsets={{bottom: 0}}
          contentContainerStyle={styles.listContent}
          list={this.state.endpoints}
          renderRow={this.renderRow.bind(this)}
        />
      </View>
    );
  }

  renderRow(endpoint, rowID, index) {
    const isLast = index < this.state.endpoints.size - 1;
    return (
      <ListItem
        title={endpoint.get('url')}
        showSeparator={isLast}
        showArrow={true}
        onPress={() => this.onPressItem(endpoint)}
      />
    );
  }

  onPressItem(endpoint) {
    this.props.navigator.push(NodesRoutes.getNodesIndexRoute(endpoint));
  }
}
