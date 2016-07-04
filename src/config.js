import ReactNative from 'react-native';
import React from 'react';
import Alt from 'alt';
import {version} from '../package.json';
import LocalesUtils from './utils/LocalesUtils';
import Intl from 'intl';
import _ from 'lodash';
import Immutable from 'immutable';
import './Stores';

const _window = global || window;

const CONFIGS = {
  dev: {
    API_ROOT: 'http://localhost:3000',
    VERSION: version,
  },
  prod: {
    API_ROOT: 'https://google.com',
    VERSION: version,
  },
};

if (!_window.Intl) {
  _window.Intl = Intl; // polyfill for `Intl`
}

// Global variables
_window.ReactNative = ReactNative;
_window.React       = React;
_window.Component   = React.Component;
_window._           = _;
_window.Immutable   = Immutable;
_window.alt         = new Alt();
_window.APP_CONFIG  = CONFIGS.dev;
_window.intl        = (...args) => LocalesUtils.getLocalizedString(...args);
_window.intlrd      = (...args) => LocalesUtils.getLocalizedRelativeDate(...args);
_window.intld       = (...args) => LocalesUtils.getLocalizedDate(...args);

if (__DEV__) {
  console.disableYellowBox = true;
}

export default _window.APP_CONFIG;
