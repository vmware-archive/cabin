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
import NativeButton from './NativeButton';

import {
  PanResponder,
  StyleSheet,
  View,
  Animated,
} from 'react-native';

const FULL_SWIPE_ACTION = 100;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  content: {
  },
  buttonsContainer: {
    position: 'absolute',
    top: 0, bottom: 0,
    flexDirection: 'row',
  },
  rightButtons: {
    right: 0,
    justifyContent: 'flex-end',
  },
  button: {
    flex: 1,
    overflow: 'hidden',
  },
});

export default class SwipeRow extends Component {

  static defaultProps = {
    sensitivity: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      btnWidth: 0,
      btnsLeftWidth: 0,
      btnsRightWidth: 0,
      contentHeight: 0,
      contentX: new Animated.Value(0),
      contentWidth: 0,
      openedRight: false,
      openedLeft: false,
      swiping: false,
      timeStart: null,
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (e, gestureState) => {
        const dx = Math.abs(gestureState.dx);
        const dy = Math.abs(gestureState.dy);
        if (dx < 3 || (dy > dx)) { return false; }
        this.props.onSwipeStart && this.props.onSwipeStart();
        return true;
      },
      onPanResponderGrant: this._handlePanResponderGrant.bind(this),
      onPanResponderMove: this._handlePanResponderMove.bind(this),
      onPanResponderRelease: this._handlePanResponderEnd.bind(this),
      onPanResponderTerminate: this._handlePanResponderEnd.bind(this),
      onShouldBlockNativeResponder: () => true,
    });
  }

  _handlePanResponderGrant() {
    this.props.onOpen && this.props.onOpen(this.props.sectionID, this.props.rowID);
    this.refs.swipeContent._component.measure((ox, oy, width) => {
      this.setState({
        btnWidth: (width / 5),
        btnsLeftWidth: this.props.left ? (width / 5) * this.props.left.length : 0,
        btnsRightWidth: this.props.right ? (width / 5) * this.props.right.length : 0,
        swiping: true, timeStart: (new Date()).getTime(),
      });
    });
  }

  _handlePanResponderMove(e: Object, gestureState: Object) {
    let posX = gestureState.dx;
    // const posY = gestureState.dy;
    const leftWidth = this.state.btnsLeftWidth;
    const rightWidth = this.state.btnsRightWidth;
    if (this.state.openedRight) {
      posX = gestureState.dx - rightWidth;
    } else if (this.state.openedLeft) { posX = gestureState.dx + leftWidth; }

    // const moveX = Math.abs(posX) > Math.abs(posY);
    // if (this.props.onSwipeStart) {
    //   if (moveX) this.props.onSwipeStart(true);
    //   else this.props.onSwipeStart(false);
    // }
    if (this.state.swiping) {
      if (posX < 0 && this.props.right) this.state.contentX.setValue(Math.min(posX, 0));
      else if (posX > 0 && this.props.left) this.state.contentX.setValue(Math.max(posX, 0));
    }
  }

  _handlePanResponderEnd(e: Object, gestureState: Object) {
    const posX = gestureState.dx;
    const contentX = this.state.contentX._value;
    const contentWidth = this.state.contentWidth;
    const btnsLeftWidth = this.state.btnsLeftWidth;
    const btnsRightWidth = this.state.btnsRightWidth;

    //  minimum threshold to open swipeout
    const openX = contentWidth * 0.33;

    //  should open swipeout
    let openLeft = posX > openX || posX > btnsLeftWidth / 2;
    let openRight = posX < -openX || posX < -btnsRightWidth / 2;

    //  account for open swipeouts
    if (this.state.openedRight) { openRight = posX - openX < -openX; }
    if (this.state.openedLeft) { openLeft = posX + openX > openX; }

    //  reveal swipeout on quick swipe
    const timeDiff = (new Date()).getTime() - this.state.timeStart < 200;
    if (timeDiff) {
      openRight = posX < -openX / 10 && !this.state.openedLeft;
      openLeft = posX > openX / 10 && !this.state.openedRight;
    }

    if (this.state.swiping) {
      if (openRight && contentX < -(btnsRightWidth + FULL_SWIPE_ACTION)) {
        // full swipe triggered
        this.animateTo(-contentWidth);
        setTimeout(() => {
          this.close();
        }, 1000);
        this.setState({ openedLeft: false, openedRight: false });
        this.triggerLastRight();
      } else if (openRight && contentX < 0 && posX < 0) {
        // open swipeout right
        this.animateTo(-btnsRightWidth);
        this.setState({ openedLeft: false, openedRight: true });
      } else if (openLeft && contentX > 0 && posX > 0) {
        // open swipeout left
        this.animateTo(btnsLeftWidth);
        this.setState({ openedLeft: true, openedRight: false });
      } else {
        // close swipeout
        this.close();
        this.setState({ openedLeft: false, openedRight: false });
      }
    }
    //  Allow scroll
    if (this.props.onSwipeEnd) this.props.onSwipeEnd();
  }

  render() {
    const inputRange = [-this.state.contentWidth, 0, this.state.contentWidth];
    const contentX = this.state.contentX.interpolate({
      inputRange,
      outputRange: [-this.state.contentWidth, 0, this.state.contentWidth],
    });

    return (
      <View style={styles.container}>
        { this.renderButtons({buttons: this.props.left, isRight: false}) }
        { this.renderButtons({buttons: this.props.right, isRight: true}) }
        <Animated.View
          ref="swipeContent"
          style={[styles.content, {left: contentX}]}
          onLayout={this.onLayout.bind(this)}
          {...this._panResponder.panHandlers}>
          {this.props.children}
        </Animated.View>
      </View>
    );
  }

  renderButtons({buttons, isRight}) {
    if (!buttons || buttons.length === 0) { return false; }
    return (
      <View style={[
        styles.buttonsContainer,
        isRight ? styles.rightButtons : styles.leftButtons,
      ]}>
        {buttons.map((button, index) => this.renderButton({button, isRight, index}))}
      </View>
    );
  }

  renderButton({button, isRight, index}) {
    let inputRange = [];
    let outputRange = [];
    if (isRight) {
      inputRange = [-this.state.btnsRightWidth, 0];
      outputRange = [this.state.btnWidth, 0];
      if (index === this.props.right.length - 1 && this.state.contentWidth > 0) {
        const reachEdge = -(this.state.btnsRightWidth + FULL_SWIPE_ACTION);
        inputRange = [-this.state.contentWidth, reachEdge - 1, reachEdge, -this.state.btnsRightWidth, 0];
        outputRange = [this.state.contentWidth, -reachEdge, this.state.btnWidth, this.state.btnWidth, 0];
      }
    } else {
      inputRange = [0, this.state.btnsLeftWidth];
      outputRange = [0, this.state.btnWidth];
    }
    const width = this.state.contentX.interpolate({
      inputRange, outputRange, extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    const style = [
      styles.button,
      {width},
      button.style,
    ];
    return (
      <Animated.View style={style} key={index}>
        <NativeButton
          style={{flex: 1}}
          onPress={button.onPress}
          underlayColor={button.underlayColor}
          disabled={button.disabled}
          textStyle={button.textStyle}>
          {button.text}
        </NativeButton>
      </Animated.View>
    );
  }

  close() {
    this.animateTo(0);
  }

  animateTo(toValue) {
    Animated.timing(this.state.contentX, {toValue, duration: 500}).start();
  }

  onLayout(event) {
    const { width, height } = event.nativeEvent.layout;
    if (width !== this.state.contentWidth || height !== this.state.contentHeight) {
      this.setState({
        contentWidth: width,
        contentHeight: height,
      });
    }
  }

  triggerLastRight() {
    const lastRight = this.props.right[this.props.right.length - 1];
    lastRight && lastRight.onPress && lastRight.onPress();
  }
}
