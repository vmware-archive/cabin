import { PropTypes } from 'react';
import Nodes from 'components/Nodes';
import AltContainer from 'alt-container';
import Colors from 'styles/Colors';

const {
  View,
  Text,
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    height: 30,
    paddingBottom: 15,
    backgroundColor: Colors.BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.BORDER,
    borderBottomWidth: 1,
  },
  endpointStatus: {
    width: 40, height: 40,
    backgroundColor: Colors.GREEN,
  },
});

export default class EndpointShow extends Component {

  static propTypes = {
    endpoint: PropTypes.instanceOf(Immutable.Map).isRequired,
  }

  render() {
    const { endpoint } = this.props;
    return (
      <View style={styles.flex}>
        <View style={styles.header}>
            <Text style={{color: Colors.WHITE}}>{endpoint.get('url')}</Text>
        </View>
        <AltContainer stores={{
          nodes: () => {
            return {
              store: alt.stores.NodesStore,
              value: alt.stores.NodesStore.getNodes(endpoint),
            };
          },
          status: () => {
            return {
              store: alt.stores.NodesStore,
              value: alt.stores.NodesStore.getStatus(endpoint),
            };
          }}}>
          <Nodes
            navigator={this.props.navigator}
            status={alt.stores.NodesStore.getStatus(endpoint)}
            nodes={alt.stores.NodesStore.getNodes(endpoint)}
          />
        </AltContainer>
      </View>
    );
  }

}
