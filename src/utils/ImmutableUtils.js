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
import * as Immutable from 'immutable';

class ImmutableUtils {

  // Convert a list to a map, keyed with ids
  static toKeyedMap(list: Immutable.List<any>, keys: Array<string> = ['id']): Immutable.Map<string, any> {
    if (!list) {
      return new Immutable.Map();
    }
    return new Immutable.Map().withMutations( (m) => {
      list.forEach( (value) => {
        m.set(value.getIn(keys), value);
      });
    });
  }

  // Convert a list to a Javascript map, keyed with ids
  static toJSKeyedMap(list: Immutable.List<any>, keys: Array<string> = ['id']): any {
    const result = {};
    if (!list) {
      return result;
    }
    list.forEach( (value) => {
      result[value.getIn(keys)] = value;
    });
    return result;
  }

  static entitiesToMap(list: Immutable.List<any>): Immutable.Map<string, any> {
    return ImmutableUtils.toKeyedMap(list, ['metadata', 'uid']);
  }

  /**
    Convert an array of Ids to an OrderedMap map of Ids for fast search
  **/
  static toIdMap(ids: Immutable.List<string>): Immutable.OrderedMap<string, boolean> {
    return new Immutable.OrderedMap().withMutations((m) => {
      ids.forEach( (id) => {
        m.set(id, true);
      });
    });
  }

  /**
    Concat two arrays and prevent duplicates object with the same key
  **/
  static concatWithoutDuplicates(list1: Immutable.List<any>, list2: Immutable.List<any>, key: string = 'id'): Immutable.List<any> {
    const all = list1.filter((v) => !!v).concat(list2.filter((v) => !!v));
    const keys = {};
    return all.filter( (item) => {
      if (keys[item.get(key)]) {
        return false;
      }
      keys[item.get(key)] = true;
      return true;
    });
  }

  static concatArrayWithoutDuplicates(list1: Immutable.List<any>, list2: Immutable.List<any>): Immutable.List<any> {
    return list1.withMutations((list) => {
      list2.forEach((item) => {
        if (!list.includes(item)) {
          list.push(item);
        }
      });
    });
  }

}

export default ImmutableUtils;
