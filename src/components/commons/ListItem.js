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
import Colors from 'styles/Colors';
import SwipeRow from 'components/commons/SwipeRow';
import EntityIcon from 'components/commons/EntityIcon';
import StatusView from 'components/commons/StatusView';
import EntitiesUtils from 'utils/EntitiesUtils';

const {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} = ReactNative;

const { PropTypes } = React;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: 50,
    paddingLeft: 15,
    paddingRight: 20,
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
  },
  left: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingLeft: 10,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 11,
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: '400',
  },
  arrow: {
    width: 10,
    height: 10,
    marginLeft: 7,
    marginTop: 6,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: '#c7c7cc',
    transform: [{
      rotate: '45deg',
    }],
  },
  separator: {
    position: 'absolute',
    bottom: 0, left: 15, right: 0,
    height: 1,
    backgroundColor: Colors.BORDER,
  },
});

export default class ListItem extends Component {

  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    detailTitle: PropTypes.string,
    isLast: PropTypes.bool,
    hideSeparator: PropTypes.bool,
    separatorStyle: View.propTypes.style,
    showArrow: PropTypes.bool,
    renderTitle: PropTypes.func,
    renderDetail: PropTypes.func,
    onPress: PropTypes.func,
    onDelete: PropTypes.func,
    deleteTitle: PropTypes.string,
    entity: PropTypes.instanceOf(Immutable.Map), // optional
  }

  render() {
    const Container = (this.props.onPress || this.props.onLongPress) ? TouchableOpacity : View;
    return (
      <SwipeRow onSwipeStart={this.props.onSwipeStart} onSwipeEnd={this.props.onSwipeEnd}
      right={this.props.onDelete && [
        {text: this.props.deleteTitle || intl('delete'), style: {backgroundColor: Colors.RED}, textStyle: {color: Colors.WHITE}, onPress: this.props.onDelete},
      ]}>
        <Container style={[styles.item, this.props.style]} onPress={this.props.onPress} onLongPress={this.props.onLongPress}>
          <View style={styles.left}>
            {this.renderTitle()}
          </View>
          <View style={styles.right}>
            {this.renderDetail()}
            {this.props.showArrow && <View style={styles.arrow}/>}
          </View>
          {!this.props.hideSeparator && <View style={[styles.separator, this.props.separatorStyle, this.props.isLast && {left: 0}]}/>}
        </Container>
      </SwipeRow>
    );
  }

  renderTitle() {
    if (this.props.renderTitle) { return this.props.renderTitle(); }
    const { entity } = this.props;
    if (entity) {
      return (
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <EntityIcon type={entity.get('kind')} status={entity.get('status')}/>
          <Text style={{flex: 1, marginLeft: 10, fontSize: 16}} numberOfLines={1}>{entity.getIn(['metadata', 'name'])}</Text>
        </View>
      );
    }
    return (
      <View style={styles.titleContainer}>
        {this.props.title && <Text style={styles.title}>{this.props.title.replace('undefined', '?')}</Text>}
        {this.props.subtitle && <Text style={styles.subtitle}>{this.props.subtitle.replace('undefined', '?')}</Text>}
      </View>
    );
  }

  renderDetail() {
    if (this.props.renderDetail) { return this.props.renderDetail(); }
    const { entity } = this.props;
    if (entity && (entity.get('kind') === 'pods' || entity.get('kind') === 'nodes')) {
      const status = EntitiesUtils.statusForEntity(entity);
      if (status) {
        return <StatusView status={status} />;
      }
    }
    return this.props.detailTitle ? <Text style={styles.detailTitle}>{this.props.detailTitle.replace('undefined', '?')}</Text> : false;
  }
}
