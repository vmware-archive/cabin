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
const { PropTypes } = React;
const {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: Colors.BACKGROUND,
  },
  emptyImage: {
    height: 140,
    width: 140,
    resizeMode: 'contain',
    marginTop: -30,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    color: Colors.BLACK,
    marginTop: 20,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.GRAY,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyButton: {
    backgroundColor: Colors.BLUE,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  emptyAction: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '400',
  },
});

export default class EmptyView extends Component {

  static propTypes = {
    image: Image.propTypes.source,
    imageStyle: Image.propTypes.style,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    actionTitle: PropTypes.string,
    onPress: PropTypes.func,
  }
  render() {
    return (
      <View style={styles.emptyContainer}>
        <Image style={[styles.emptyImage, this.props.imageStyle]} source={this.props.image} />
        <Text style={styles.emptyTitle}>{this.props.title}</Text>
        <Text style={styles.emptySubtitle}>{this.props.subtitle}</Text>
        {this.props.onPress && <TouchableOpacity style={styles.emptyButton} onPress={this.props.onPress}>
          <Text style={styles.emptyAction}>{this.props.actionTitle}</Text>
        </TouchableOpacity>}
      </View>
    );
  }
}
