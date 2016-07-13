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
import LabelsView from 'components/commons/LabelsView';
import PodsActions from 'actions/PodsActions';

const {
  View,
  StyleSheet,
  ScrollView,
} = ReactNative;

const { PropTypes } = React;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  list: {
    flex: 1,
    paddingTop: 40,
  },
  section: {
    marginBottom: 20,
    borderColor: Colors.BORDER,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    paddingHorizontal: 15,
    marginBottom: 6,
    fontSize: 13,
    color: '#6d6d72',
  },
});

export default class PodsShow extends Component {

  static propTypes = {
    entity: PropTypes.instanceOf(Immutable.Map),
    cluster: PropTypes.instanceOf(Immutable.Map),
  }

  render() {
    const { entity } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.list}>
          <View style={styles.section}>
            <ListItem title="Name" detailTitle={entity.getIn(['metadata', 'name'])}/>
            {entity.getIn(['status', 'phase']) && <ListItem title="Status" detailTitle={entity.getIn(['status', 'phase'])}/>}
            <ListItem title="Version" detailTitle={`${entity.getIn(['metadata', 'resourceVersion'])}`}/>
            <ListItem title="UID" subtitle={entity.getIn(['metadata', 'uid'])} isLast={true}/>
          </View>
          <LabelsView entity={entity} onSubmit={this.handleLabelSubmit.bind(this)} onDelete={this.handleLabelDelete.bind(this)} />
        </ScrollView>
      </View>
    );
  }

  handleLabelSubmit({key, value}) {
    return PodsActions.addPodLabel({pod: this.props.entity, cluster: this.props.cluster, key, value});
  }

  handleLabelDelete(key) {
    return PodsActions.deletePodLabel({pod: this.props.entity, cluster: this.props.cluster, key});
  }
}
