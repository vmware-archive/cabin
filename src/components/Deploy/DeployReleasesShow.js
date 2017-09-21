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
import ListItem from 'components/commons/ListItem';
import ListHeader from 'components/commons/ListHeader';
import ScrollView from 'components/commons/ScrollView';
import ChartsUtils from 'utils/ChartsUtils';

const {
  View,
  Text,
  Image,
  StyleSheet,
} = ReactNative;

import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  list: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
  },
});

export default class DeployReleasesShow extends Component {

  static propTypes = {
    release: PropTypes.instanceOf(Immutable.Map),
    cluster: PropTypes.instanceOf(Immutable.Map),
  }

  render() {
    const { release } = this.props;
    const chart = release.get('chart');
    const info = release.get('info');
    return (
      <View style={styles.container}>
        <ScrollView style={styles.list}>
          <View style={styles.section}>
            <ListHeader title="Release"/>
            <ListItem title="Name" detailTitle={release.get('name')}/>
            <ListItem title="Namespace" detailTitle={release.get('namespace')}/>
            <ListItem title="Version" detailTitle={`${release.get('version')}`}/>
            <ListItem title="Status" detailTitle={ChartsUtils.releaseStatusForCode(info.get('status'))}/>
            {info.get('deleted') !== 0 && <ListItem title="Deleted" detailTitle={intlrd(new Date(info.get('deleted') * 1000))}/>}
            <ListItem title="First Deployed" detailTitle={intlrd(new Date(info.get('firstDeployed') * 1000))}/>
            <ListItem title="Last Deployed" isLast={true} detailTitle={intlrd(new Date(info.get('firstDeployed') * 1000))}/>
          </View>
          <View style={styles.section}>
            <ListHeader title="Chart"/>
            <ListItem renderTitle={() => {
              return (
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <Image style={{width: 30, height: 30}} source={ChartsUtils.iconForChart(release.getIn(['chart', 'name']))}/>
                  <Text style={{flex: 1, marginLeft: 8, fontSize: 16}} numberOfLines={1}>{release.getIn(['chart', 'name'])}</Text>
                </View>
              );
            }}/>
            <ListItem style={{height: null, paddingVertical: 10}}
              renderTitle={() => <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={styles.description}>{chart.get('description')}</Text>
              </View>}
            />
            <ListItem title="Version" detailTitle={`${chart.get('version')}`}/>
            <ListItem title="Home" detailTitle={chart.get('home')} isLast={true}/>
          </View>
        </ScrollView>
      </View>
    );
  }

}
