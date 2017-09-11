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

const { PropTypes } = React;
const { Text, View, StyleSheet, TextInput } = ReactNative;

const styles = StyleSheet.create({
  listItem: {
    height: 55,
  },
  inputContainer: {
    flex: 1,
    paddingTop: 2,
  },
  input: {
    flex: 1,
    marginTop: -4,
  },
  detailInput: {
    textAlign: 'right',
  },
  label: {
    color: Colors.GRAY,
  },
});

export default class ListInputItem extends Component {
  static propTypes = {
    ...ListItem.propTypes,
    ...TextInput.propTypes,
    detailInput: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      emptyText: props.defaultValue ? false : true,
    };
  }

  render() {
    const { detailInput } = this.props;
    return (
      <ListItem
        {...this.props}
        style={styles.listItem}
        renderTitle={!detailInput ? this.renderTitle : null}
        renderDetail={detailInput ? this.renderDetail : null}
      />
    );
  }

  renderTitle = () => {
    if (this.props.detailInput) {
      return false;
    }

    return (
      <View style={styles.inputContainer}>
        {!this.state.emptyText &&
          <Text style={styles.label}>{this.props.placeholder}</Text>}
        <TextInput
          {...this.props}
          ref={e => {
            this.input = e;
          }}
          style={styles.input}
          onChangeText={t => {
            this.setState({ emptyText: t === '' });
            this.props.onChangeText && this.props.onChangeText(t);
          }}
        />
      </View>
    );
  };

  renderDetail = () => {
    if (!this.props.detailInput) {
      return false;
    }
    return (
      <TextInput
        {...this.props}
        ref={e => {
          this.input = e;
        }}
        style={styles.detailInput}
        onChangeText={t => {
          this.setState({ emptyText: t === '' });
          this.props.onChangeText && this.props.onChangeText(t);
        }}
      />
    );
  };

  setText(text) {
    this.input.setNativeProps({ text });
  }
}
