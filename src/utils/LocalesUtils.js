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
import IntlMessageFormat from 'intl-messageformat';
import IntlRelativeFormat from 'intl-relativeformat';
import _ from 'lodash';
import frLocales from '../locales/fr.json';
import enLocales from '../locales/en.json';

const ONE_MINUTE = 60;
const ONE_HOUR = 3600;
const ONE_DAY = ONE_HOUR * 24;
const ONE_WEEK = ONE_DAY * 7;
const ONE_MONTH = ONE_DAY * 30;
const ONE_YEAR = ONE_DAY * 365;

class LocalesUtils {

  static initLocales(lang = LocalesUtils.DEFAULT_LANGUAGE) {
    this.setLanguage(lang);
    this.defaultLocales = enLocales;
  }

  static _getBestLanguage(lang) {
    if (_.includes(LocalesUtils.SUPPORTED_LANGUAGES, lang)) {
      return lang;
    }
    lang = lang.split('-')[0];
    if (_.includes(LocalesUtils.SUPPORTED_LANGUAGES, lang)) { // check if we can use 'es' for 'es-ES' for example
      return lang;
    }
    return LocalesUtils.DEFAULT_LANGUAGE;
  }

  static _getLocales() {
    switch (this.lang) {
      case 'fr':
        this.locales = frLocales;
        break;
    }
  }

  static setLanguage(lang) {
    this.locales = {};
    this.lang = this._getBestLanguage(lang);
    this._getLocales();
  }

  static getLanguage() {
    if (!this.lang || !this.locales || !this.defaultLocales) {
      this.initLocales();
    }
    return this.lang;
  }

  // TODO: Add better fallback? (es-ES -> es -> en)
  static getLocalizedString(id, values) {
    const lang = this.getLanguage();
    const locale = this.locales[id] || this.defaultLocales[id];
    const formater = new IntlMessageFormat(locale, lang);
    return formater.format(values);
  }

  static getLocalizedRelativeDate(date, options) {
    const lang = this.getLanguage();
    const formater = new IntlRelativeFormat(lang, options);
    console.log('date: ', date, new Date());
    return formater.format(new Date(date), options);
  }

  static getLocalizedDate(date, options) {
    const lang = this.getLanguage();
    return new Intl.DateTimeFormat(lang, options).format(date);
  }

  static getShortTimeAgo(date) {
    const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (diff < ONE_MINUTE) {
      return intl('now');
    } else if (diff < ONE_HOUR) {
      return `${Math.floor(diff / ONE_MINUTE)}min`;
    } else if (diff < ONE_DAY) {
      return `${Math.floor(diff / ONE_HOUR)}h`;
    } else if (diff < ONE_WEEK) {
      return `${Math.floor(diff / ONE_DAY)}${intl('d')}`;
    } else if (diff < ONE_MONTH) {
      return `${Math.floor(diff / ONE_WEEK)}${intl('w')}`;
    } else if (diff < ONE_YEAR) {
      return `${Math.floor(diff / ONE_MONTH)}m`;
    }
    return `${Math.floor(diff / ONE_YEAR)}${intl('y')}`;
  }

  static getLocalizedBestFitDate(date) {
    const lang = this.getLanguage();
    const options = {hour: 'numeric', minute: 'numeric'};
    const now = new Date();
    if (!date.isSame(now, 'year')) {
      options.day = 'numeric';
      options.month = 'short';
      options.year = 'numeric';
    } else if (!date.isSame(now, 'month')) {
      options.day = 'numeric';
      options.month = 'short';
    } else if (!date.isSame(now, 'day')) {
      options.weekday = 'short';
    }
    return new Intl.DateTimeFormat(lang, options).format(date);
  }
}

LocalesUtils.DEFAULT_LANGUAGE = 'en';
LocalesUtils.SUPPORTED_LANGUAGES = ['en', 'fr'];

export default LocalesUtils;
