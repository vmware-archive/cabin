import Colors from 'styles/Colors';
import ListItem from 'components/commons/ListItem';

const {
  View,
  StyleSheet,
  ScrollView,
  Text,
} = ReactNative;

const { PropTypes } = React;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  list: {
    flex: 1,
    paddingTop: 40,
  },
  section: {
    marginBottom: 20,
    borderColor: Colors.BORDER,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    paddingHorizontal: 15,
    marginBottom: 6,
    fontSize: 13,
    color: '#6d6d72',
  },
});

export default class NodesShow extends Component {

  static propTypes = {
    node: PropTypes.instanceOf(Immutable.Map),
  }

  render() {
    const { node } = this.props;
    const labels = node.getIn(['metadata', 'labels'], Immutable.List());
    let count = labels.size;
    const labelItems = labels.map((value, key) => {
      count--;
      return <ListItem title={key} subtitle={value} showSeparator={count !== 0}/>;
    });
    return (
      <View style={styles.container}>
        <ScrollView style={styles.list}>
          <View style={styles.section}>
            <ListItem title={node.getIn(['metadata', 'name'])}/>
            <ListItem title="Version" detailTitle={node.getIn(['metadata', 'resourceVersion'])}/>
            <ListItem title="UID" subtitle={node.getIn(['metadata', 'uid'])} showSeparator={false}/>
          </View>

          <Text style={styles.sectionTitle}>LABELS</Text>
          <View style={styles.section}>
            {labelItems}
          </View>
        </ScrollView>
      </View>
    );
  }

}
