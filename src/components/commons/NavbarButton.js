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

import PropTypes from 'prop-types';
const {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    tintColor: Colors.WHITE,
    width: 20, height: 20,
    resizeMode: 'contain',
  },
  text: {
    color: Colors.WHITE,
    fontSize: 17,
  },
});

class NavbarButton extends Component {

  static propTypes = {
    onPress: PropTypes.func.isRequired,
    title: PropTypes.string,
    source: Image.propTypes.source,
  };

  render() {
    const { title, source } = this.props;
    return (
      <TouchableOpacity onPress={this.props.onPress} style={styles.container}>
        {title && <Text style={[styles.text, this.props.style]}>{title}</Text>}
        {source && <Image source={source} style={[styles.image, this.props.style]} />}
      </TouchableOpacity>
    );
  }

}

export default NavbarButton;
