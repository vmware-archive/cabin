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
import ActionSheetUtils from 'utils/ActionSheetUtils';

const {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} = ReactNative;

const { PropTypes } = React;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BLUE,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    flexDirection: 'row',
  },
  text: {
    color: Colors.WHITE,
  },
  containerText: {
    fontWeight: '700',
  },
  arrow: {
    tintColor: Colors.WHITE,
    width: 10, height: 10,
    marginLeft: 4,
    resizeMode: 'contain',
  },
  loader: {
    position: 'absolute',
    right: 12,
    top: 0,
  },
});

export default class PodsContainerPicker extends Component {

  static propTypes = {
    selectedContainer: PropTypes.string,
    pod: PropTypes.instanceOf(Immutable.Map),
    cluster: PropTypes.instanceOf(Immutable.Map),
    onChangeContainer: PropTypes.func.isRequired,
    loading: PropTypes.bool,
  }

  render() {
    const container = this.props.selectedContainer;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.innerContainer} onPress={this.handlePress.bind(this)}>
          <Text style={styles.text}>
            Container:
            <Text style={styles.containerText}> {container}</Text>
          </Text>
          <Image source={require('images/arrow-down.png')} style={styles.arrow}/>
          {this.props.loading && <ActivityIndicator style={styles.loader} color={Colors.WHITE}/>}
        </TouchableOpacity>
      </View>
    );
  }

  handlePress() {
    const containers = this.props.pod.getIn(['spec', 'containers'], Immutable.List());

    const onPress = (index) => {
      const container = containers.getIn([index - 1, 'name']);
      if (container !== this.props.selectedContainer) {
        this.props.onChangeContainer(container);
      }
    };
    const options = [
      { title: intl('cancel'), cancel: true},
      ...containers.map(c => { return {title: c.get('name'), onPress};}),
    ];
    ActionSheetUtils.showActionSheetWithOptions({options});
  }

}
