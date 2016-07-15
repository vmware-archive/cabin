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
import { PropTypes } from 'react';
import Colors from 'styles/Colors';

const {
  ScrollView,
  RefreshControl,
} = ReactNative;

/**
* An enhanced ScrollView component able to handle
**/
export default class EnhancedScrollView extends Component {

  static propTypes = {
    ...ScrollView.propTypes,
    // Call when pull to refresh is triggered
    onRefresh: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this._userPulledRefresh = false;
  }

  componentWillReceiveProps() {
    this._userPulledRefresh = false;
  }

  render() {
    const isRefreshing = this._userPulledRefresh;

    return (
      <ScrollView
        {...this.props}
        refreshControl={
          this.props.onRefresh && <RefreshControl
          refreshing={isRefreshing}
          onRefresh={this.handleRefresh.bind(this)}
          colors={[Colors.BLUE, Colors.RED, Colors.ORANGE]}
          progressBackgroundColor={Colors.WHITE}
          />
        }/>
    );
  }

  handleRefresh() {
    this._userPulledRefresh = true;
    this.props.onRefresh();
  }

}
