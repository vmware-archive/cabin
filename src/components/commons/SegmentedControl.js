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
import PropTypes from 'prop-types';
import Colors from 'styles/Colors';
import _ from 'lodash';
import PStyleSheet from 'styles/PStyleSheet';

const {
  View,
  Text,
  Animated,
  TouchableOpacity,
} = ReactNative;

const styles = PStyleSheet.create({
  container: {
    height: 30,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  absolute: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  firstControl: {
    ios: {
      borderTopLeftRadius: 3,
      borderBottomLeftRadius: 3,
    },
    borderLeftWidth: 1,
  },
  lastControl: {
    ios: {
      borderTopRightRadius: 3,
      borderBottomRightRadius: 3,
    },
    borderRightWidth: 1,
  },
  control: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 13,
    paddingRight: 8,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
  label: {
    fontSize: 13,
  },
  separator: {
    height: 32,
    width: 1,
  },
  activeBackground: {
    height: 30,
    flex: 1,
  },
  badge: {
    position: 'relative',
    marginLeft: 1,
    marginBottom: 5,
  },
});

export default class SegmentedControl extends Component {

  static PropTypes = {
    controls: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedIndex: PropTypes.instanceOf(Animated.Value),
    onPress: PropTypes.func.isRequired,
    borderColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,

    activeColor: PropTypes.string,
  };

  static defaultProps = {
    selectedIndex: new Animated.Value(0),
    activeTextColor: Colors.BLUE,
    activeColor: Colors.WHITE,
    inactiveTextColor: 'rgba(255, 255, 255, 0.6)',
  };

  render() {
    const controlsCount = this.props.controls.length;
    const activeTextColor = this.props.activeTextColor;
    const borderColor = this.props.borderColor || this.props.activeColor;
    const inactiveTextColor = this.props.inactiveTextColor;
    const activeColor = this.props.activeColor;
    const selectedIndex = this.props.selectedIndex;
    const extrapolateLeft = 'clamp';
    const extrapolateRight = 'clamp';
    const controls = this.props.controls.map((control, index) => {
      const inputRange = _.range(controlsCount);
      const outputRange = _.times(controlsCount, (i) => i === index ? activeTextColor : inactiveTextColor);
      const textColor = selectedIndex.interpolate({inputRange, outputRange, extrapolateLeft, extrapolateRight});
      const separatorOutputRange = _.times(controlsCount, (i) => index === i || index === i - 1 ? activeColor : borderColor);
      const separatorColor = selectedIndex.interpolate({inputRange, outputRange: separatorOutputRange, extrapolateLeft, extrapolateRight});
      const last = index === this.props.controls.length - 1;
      return [
        <TouchableOpacity key={`tab${index}`} onPress={() => this.props.onPress(index)}
          style={[
            styles.control,
            index === 0 && styles.firstControl,
            last && styles.lastControl,
            { borderColor },
          ]}>
          <Animated.Text
            numberOfLines={1}
            style={[styles.label, {color: textColor}]}
          >
            {control}
          </Animated.Text>
        </TouchableOpacity>,
        !last && <Animated.View key={`sep_${index}`} style={[styles.separator, {backgroundColor: separatorColor}]}/>,
      ];
    });

    const flexContainerBefore =  {flex: this.props.selectedIndex};
    const flexContainerAfter =  {flex: this.props.selectedIndex.interpolate({
      inputRange: [0, controlsCount - 1],
      outputRange: [controlsCount - 1, 0],
    })};

    return (
      <View style={[styles.container, this.props.style]}>
        <View style={[styles.absolute, styles.row, {borderRadius: 3}]}>
          <Animated.View style={flexContainerBefore} />
          <View style={[styles.activeBackground, {backgroundColor: activeColor}]} />
          <Animated.View style={flexContainerAfter} />
        </View>
        <View style={styles.row}>
          {controls}
        </View>
      </View>
    );
  }

}
