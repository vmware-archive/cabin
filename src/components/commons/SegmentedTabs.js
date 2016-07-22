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
import Sizes from 'styles/Sizes';
import _ from 'lodash';
import PStyleSheet from 'styles/PStyleSheet';

const { PropTypes } = React;
import {
  Animated,
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  ScrollView,
} from 'react-native';

const Touchable = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

const styles = PStyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
    flexDirection: 'row',
  },
  controlContainer: {
    android: {
      flex: 0,
      height: Sizes.NAVIGATOR_HEIGHT - 2,
    },
    ios: {
      height: Sizes.NAVIGATOR_HEIGHT - 20,
    },
  },
  control: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: Colors.BLACK,
  },
  indicator: {
    backgroundColor: Colors.BLUE,
    height: 2,
    position: 'absolute',
    marginBottom: -1,
    left: 0, bottom: 0,
  },
});

export default class SegmentedTabs extends Component {

  static propTypes = {
    controls: PropTypes.instanceOf(Immutable.List).isRequired,
    onPress: PropTypes.func.isRequired,
    selectedIndex: PropTypes.instanceOf(Animated.Value).isRequired,
    activeColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    isScrollable: PropTypes.bool,
  };

  static defaultProps = {
    activeColor: Colors.BLUE,
    activeTextColor: Colors.BLUE,
    inactiveTextColor: 'rgba(0, 0, 0, 0.5)',
    isScrollable: false,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isScrollable: props.isScrollable,
    };
    this.layouts = [];
    this.scrollValue = 0;
    this.counter = props.controls.size;
  }

  componentWillUpdate(nextProps) {
    if (!Immutable.is(nextProps.controls, this.props.controls)) {
      const changed = nextProps.controls.count((control, i) => {
        return this.props.controls.get(i) !== control;
      });
      this.counter = changed;
      if (this.props.isScrollable) {
        this.setState({isScrollable: true});
      }
      if (nextProps.controls.size !== this.props.controls.size) {
        this.handlePress(0);
      }
    }
  }

  render() {
    const { activeColor, activeTextColor, inactiveTextColor, controls, selectedIndex } = this.props;
    const { isScrollable } = this.state;
    const controlsCount = controls.size;
    if (controlsCount === 1) { return this.renderOneItem(); }
    const windowWidth = Dimensions.get('window').width;
    const defaultWidth = windowWidth / controlsCount;
    const containerPadding = isScrollable ? 10 : 0;
    const widths = isScrollable && this.counter === 0 ? this.layouts.slice(0, controlsCount).map(l => l.width) : controls.map(() => defaultWidth).toJS();

    const inputRange = _.range(controlsCount);
    const animatedWidth = selectedIndex.interpolate({
      inputRange,
      outputRange: widths,
    });
    let sum = containerPadding;
    const margins = widths.map(w => {
      const result = sum;
      sum = sum + w;
      return result;
    });
    const indicatorMargin = selectedIndex.interpolate({
      inputRange,
      outputRange: margins,
    });

    const items = controls.map( (control, index) => {
      const outputRange = _.times(controlsCount, (i) => i === index ? activeTextColor : inactiveTextColor);
      const textColor = this.props.selectedIndex.interpolate({inputRange, outputRange, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      return (
        <View key={`tab${index}`}
          style={styles.controlContainer}
          collapsable={false}
          onLayout={isScrollable ? e => this.handleControlLayout(index, e) : undefined}>
          <Touchable
            onPress={() => this.handlePress(index)}
            style={[styles.control, isScrollable ? {paddingHorizontal: 10} : {width: defaultWidth}]}>
            <Animated.Text style={[styles.label, {color: textColor}]} numberOfLines={1}>{control}</Animated.Text>
          </Touchable>
        </View>
      );
    });

    return (
      <View style={styles.container}>
        <ScrollView
          ref="scrollView"
          style={styles.scrollView}
          scrollEnabled={isScrollable}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          scrollEventThrottle={200}
          onScroll={!isScrollable ? undefined : e => {
            this.scrollValue = e.nativeEvent.contentOffset.x;
          }}
          contentContainerStyle={isScrollable && {paddingHorizontal: containerPadding}}>
          {items}
          <Animated.View style={[styles.indicator, {backgroundColor: activeColor, width: animatedWidth, marginLeft: indicatorMargin, marginTop: -10}]} />
        </ScrollView>
      </View>
    );
  }

  renderOneItem() {
    const { controls, activeTextColor, activeColor } = this.props;
    const first = controls.first();
    return (
      <View key={`tab${0}`} style={styles.controlContainer}>
        <Touchable
          onPress={() => this.handlePress(0)}
          style={styles.control}>
          <View style={{flex: 1, borderColor: activeColor, borderBottomWidth: 2, paddingTop: 15, paddingHorizontal: 10}}>
            <Text style={[styles.label, {color: activeTextColor}]} numberOfLines={1}>{first}</Text>
          </View>
        </Touchable>
      </View>
    );
  }

  handleControlLayout(index, e) {
    this.counter--;
    this.layouts[index] = e.nativeEvent.layout;
    if (this.counter === 0) {
      const windowWidth = Dimensions.get('window').width;
      let shouldScroll = false;
      const fullWidth = this.layouts.reduce((sum, layout) => {
        if (!shouldScroll && layout.width > windowWidth / this.layouts.length) {
          shouldScroll = true;
        }
        return sum + layout.width;
      }, 0);
      if (!shouldScroll || fullWidth < windowWidth - 50) {
        this.setState({isScrollable: false});
      } else {
        this.forceUpdate();
      }
    }
  }

  handlePress(index) {
    if (this.state.isScrollable && this.layouts[index]) {
      const layout = this.layouts[index];
      const windowWidth = Dimensions.get('window').width;
      if (layout.x < this.scrollValue) {
        this.scrollValue = layout.x;
        if (index > 0) {
          this.scrollValue -= 30;
        }
        this.refs.scrollView.scrollTo({x: this.scrollValue, y: 0});
      } else if ((layout.x + layout.width) - this.scrollValue > windowWidth) {
        this.scrollValue = layout.x + layout.width - windowWidth;
        if (index < this.props.controls.size - 1) {
          this.scrollValue += 30;
        }
        this.refs.scrollView.scrollTo({x: this.scrollValue, y: 0});
      }
    }
    this.props.onPress(index);
  }
}
