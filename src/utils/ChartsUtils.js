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

import icons from 'images/charts/all';
import defaultIcon from 'images/charts/default.png';
import ImmutableUtils from './ImmutableUtils';

export default class ChartsUtils {

  static iconForChart(name) {
    const found = icons.find(icon => name.indexOf(icon.get('name')) !== -1);
    return found ? found.get('icon') : defaultIcon;
  }

  static parseCharts(charts) {
    if (charts.get('entries')) {
      charts = charts.get('entries').map(entry => {
        const first = entry.first();
        return first.set('url', first.getIn(['urls', 0])).set('chartfile', first);
      });
    }
    return ImmutableUtils.toKeyedMap(charts.toList(), ['url']);
  }

  static releaseStatusForCode(code) {
    switch (code) {
      case 0: return 'unknown';
      case 1: return 'deployed';
      case 2: return 'deleted';
      case 3: return 'superseded';
      case 4: return 'failed';
      default: return 'unknown';
    }
  }
}
