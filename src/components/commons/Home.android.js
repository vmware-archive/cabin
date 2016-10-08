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
import ClustersRoutes from 'routes/ClustersRoutes';
import DeployRoutes from 'routes/DeployRoutes';
import SettingsRoutes from 'routes/SettingsRoutes';
import Colors from 'styles/Colors';
import NativeTouchable from 'components/commons/NativeTouchable';

const {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  View,
  ViewPagerAndroid,
} = ReactNative;

const NB_TABS = 3;

const styles = StyleSheet.create({
  tabBarContainer: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE,
    borderColor: Colors.BORDER,
    borderBottomWidth: 1,
  },
  tabBarItemContainer: {
    flex: 1,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    backgroundColor: Colors.BLUE,
    height: 2,
    position: 'absolute',
    marginBottom: -1,
    left: 0, bottom: 0,
  },
});

export default class HomeAndroid extends Component {

  constructor() {
    super();
    this.state = {
      pageOffset: new Animated.Value(0),
      dragOffset: new Animated.Value(0),
      index: 0,
    };
    this.selectedIndex = Animated.add(this.state.pageOffset, this.state.dragOffset);
    this.options = [
      { title: 'Clusters', source: require('images/target.png')},
      { title: 'Deploy', source: require('images/upload.png')},
      { title: 'Settings', source: require('images/settings.png')},
    ];
  }

  render() {
    const { navigator } = this.props;

    return (
      <View style={{flex: 1}}>
        {this.renderTabBar()}
        <ViewPagerAndroid
          ref="viewPager"
          style={{flex: 1}}
          onPageSelected={(e) => this.setState({ index: e.nativeEvent.position })}
          onPageScroll={Animated.event([{ nativeEvent: { offset: this.state.dragOffset, position: this.state.pageOffset } }])}>
          <View style={{flex: 1}}>
            {ClustersRoutes.getClustersIndexRoute().renderScene(navigator)}
          </View>
          <View style={{flex: 1}}>
            {DeployRoutes.getDeployIndexRoute().renderScene(navigator)}
          </View>
          <View style={{flex: 1}}>
            {SettingsRoutes.getSettingsIndexRoute().renderScene(navigator)}
          </View>
        </ViewPagerAndroid>
      </View>
    );
  }

  renderTabBar() {
    const tabBarIndicatorWidth = Dimensions.get('window').width / NB_TABS;
    const indicatorMargin = this.selectedIndex.interpolate({
      inputRange: [0, NB_TABS],
      outputRange: [0, tabBarIndicatorWidth * NB_TABS],
    });
    return (
      <View style={styles.tabBarContainer}>
        {this.options.map(this.renderTabBarItem.bind(this))}
        <Animated.View style={[styles.indicator, { backgroundColor: Colors.BLUE, width: tabBarIndicatorWidth, marginLeft: indicatorMargin }]} />
      </View>
    );
  }

  renderTabBarItem(option, index) {
    const isSelected = index === this.state.index;
    const onTabPress = () => {
      this.setState({ index });
      this.refs.viewPager.setPage(index);
    };

    return (
      <NativeTouchable style={styles.tabBarItemContainer} key={option.title} onPress={onTabPress} onLongPress={onTabPress}>
        <Image source={option.source} style={{tintColor: isSelected ? Colors.BLUE : Colors.GRAY}} />
      </NativeTouchable>
    );
  }
}
