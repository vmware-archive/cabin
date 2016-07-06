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
  ListView,
  ScrollView,
  RefreshControl,
} = ReactNative;

/**
* An enhanced ListView component able to handle
**/
class CollectionView extends Component {

  static propTypes = {
    ...ListView.propTypes,

    // The list of item to render
    list: PropTypes.instanceOf(Immutable.List).isRequired,

    // The method which will render an item
    renderRow: PropTypes.func.isRequired,

    // Optional - a header
    renderHeader: PropTypes.func,

    // Optional - a footer (added before status footer)
    renderFooter: PropTypes.func,

    // Optional - loadingView for StatusView
    renderLoading: PropTypes.func,

    // Optional - emptyView for StatusView
    renderEmpty: PropTypes.func,

    // Call each time the end of the list is reached
    onGetNextPage: PropTypes.func,
    hasNextPage: PropTypes.bool,

    // Call when pull to refresh is triggered
    onRefresh: PropTypes.func,
  };

  static defaultProps = {
    hasNextPage: false,
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => !Immutable.is(row1, row2),
    }),
    renderScrollComponent: (props) => <ScrollView {...props}/>,
  };

  constructor(props) {
    super(props);
    this.state = {
      dataSource: props.dataSource,
    };
    this._userPulledRefresh = false;
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(nextProps.list, this.props.list)
      || nextProps.hasNextPage !== this.props.hasNextPage
      || nextProps.scrollEnabled !== this.props.scrollEnabled;
  }

  componentWillReceiveProps() {
    this._userPulledRefresh = false;
  }

  render() {
    const isRefreshing = this._userPulledRefresh;
    const list = this.props.list.toArray();
    const dataSource = this.state.dataSource.cloneWithRows(list);

    return (
      <ListView
        {...this.props}
        removeClippedSubviews={false}
        enableEmptySections={true}
        automaticallyAdjustContentInsets={false}
        dataSource={dataSource}
        onEndReached={this.handleGetNextPage.bind(this)}
        loadData={this.props.onRefresh}
        style={this.props.style}
        refreshControl={
          this.props.onRefresh &&
          <RefreshControl
          refreshing={isRefreshing}
          onRefresh={this.handleRefresh.bind(this)}
          colors={[Colors.BLUE, Colors.RED, Colors.ORANGE]}
          progressBackgroundColor={Colors.WHITE}
          />
        }
      />
    );
  }

  handleGetNextPage() {
    // Avoid Overfetch
    if (this.props.onGetNextPage && this.props.hasNextPage) {
      this.props.onGetNextPage();
    }
  }

  handleRefresh() {
    this._userPulledRefresh = true;
    this.props.onRefresh();
  }

}

export default CollectionView;
