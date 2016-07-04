import NodesApi from 'api/NodesApi';
import NodesRoutes from 'routes/NodesRoutes';
import CollectionView from 'components/commons/CollectionView';
import Colors from 'styles/Colors';
import ListItem from 'components/commons/ListItem';

const {
  View,
  StyleSheet,
  ActivityIndicatorIOS,
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
    endpoint: PropTypes.instanceOf(Immutable.Map),
  }

  constructor() {
    super();
    this.state = {
      nodes: Immutable.List(),
      status: 'loading',
    };
  }

  componentDidMount() {
    this.refresh();
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.status === 'loading' ?
          <ActivityIndicatorIOS style={{flex: 1}}/> :
          <CollectionView style={styles.list}
            contentContainerStyle={styles.listContent}
            contentInset={{bottom: 40}}
            scrollIndicatorInsets={{bottom: 0}}
            list={this.state.nodes}
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

  refresh() {
    NodesApi.fetchNodes(this.props.endpoint).then(nodes => this.setState({nodes, status: 'success'}));
  }

  onPressItem(node) {
    this.props.navigator.push(NodesRoutes.getNodesShowRoute(node));
  }
}
