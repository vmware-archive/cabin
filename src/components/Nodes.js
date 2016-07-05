import NodesRoutes from 'routes/NodesRoutes';
import CollectionView from 'components/commons/CollectionView';
import Colors from 'styles/Colors';
import ListItem from 'components/commons/ListItem';
import NodesActions from 'actions/NodesActions';

const {
  View,
  StyleSheet,
  ActivityIndicator,
} = ReactNative;

const { PropTypes } = React;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  list: {
    flex: 1,
  },
  listContent: {
    marginTop: 40,
    borderColor: Colors.BORDER,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
});

export default class Nodes extends Component {

  static propTypes = {
    endpoint: PropTypes.instanceOf(Immutable.Map).isRequired,
  }

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    alt.stores.NodesStore.listen(this.onChange);
    this.refresh();
  }

  componentWillUnmount() {
    alt.stores.NodesStore.unlisten(this.onChange);
  }

  render() {
    const status = alt.stores.NodesStore.getStatus(this.props.endpoint);
    const nodes = alt.stores.NodesStore.getNodes(this.props.endpoint);
    return (
      <View style={styles.container}>
        {status === 'loading' ?
          <ActivityIndicator style={{flex: 1}}/> :
          <CollectionView style={styles.list}
            contentContainerStyle={styles.listContent}
            contentInset={{bottom: 40}}
            scrollIndicatorInsets={{bottom: 0}}
            list={nodes}
            onRefresh={this.refresh.bind(this)}
            renderRow={this.renderRow.bind(this)}
          />
        }
      </View>
    );
  }

  renderRow(node, rowID, index) {
    const showSeparator = index < this.state.nodes.size - 1;
    return (
      <ListItem
        title={node.getIn(['metadata', 'name'])}
        showArrow={true}
        showSeparator={showSeparator}
        onPress={() => this.onPressItem(node)}
      />
    );
  }

  onChange() {
    this.forceUpdate();
  }

  refresh() {
    NodesActions.fetchNodes(this.props.endpoint);
  }

  onPressItem(node) {
    this.props.navigator.push(NodesRoutes.getNodesShowRoute(node));
  }
}
