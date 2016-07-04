/**
 * Copyright 2016 Facebook, Inc.
 *
 * @providesModule F8StyleSheet
 * @flow
 */

import {StyleSheet, Platform} from 'react-native';

/*eslint-disable */
export default {
  create: (styles: Object): {[name: string]: number} => {
    const platformStyles = {};
    Object.keys(styles).forEach((name) => {
      let {ios, android, ...style} = {...styles[name]};
      if (ios && Platform.OS === 'ios') {
        style = {...style, ...ios};
      }
      if (android && Platform.OS === 'android') {
        style = {...style, ...android};
      }
      platformStyles[name] = style;
    });
    return StyleSheet.create(platformStyles);
  }
}
