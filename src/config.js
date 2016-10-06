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
import ReactNative from 'react-native';
import React from 'react';
import alt from './alt';
import {version} from '../package.json';
import LocalesUtils from './utils/LocalesUtils';
import Intl from 'intl';
import _ from 'lodash';
import Immutable from 'immutable';
import './Stores';
import Constants from 'utils/Constants';

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

// import locales we are using. This should be in sync with `LocalesUtils.SUPPORTED_LANGUAGES`
import 'intl/locale-data/jsonp/en.js';
import 'intl/locale-data/jsonp/fr.js';

if (ReactNative.NativeModules.SKPNetwork) {
  _window.fetch = ReactNative.NativeModules.SKPNetwork.fetch;
}

// Global variables
_window.ReactNative = ReactNative;
_window.React       = React;
_window.Component   = React.Component;
_window._           = _;
_window.Immutable   = Immutable;
_window.alt         = alt;
_window.APP_CONFIG  = CONFIGS.dev;
_window.Constants   = Constants;
_window.intl        = (...args) => LocalesUtils.getLocalizedString(...args);
_window.intlrd      = (...args) => LocalesUtils.getLocalizedRelativeDate(...args);
_window.intld       = (...args) => LocalesUtils.getLocalizedDate(...args);

if (__DEV__) {
  console.disableYellowBox = true;
}

export default _window.APP_CONFIG;
