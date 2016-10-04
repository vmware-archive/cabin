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
import ScrollView from 'components/commons/ScrollView';
import ListItem from 'components/commons/ListItem';
import ListHeader from 'components/commons/ListHeader';
import ChartsUtils from 'utils/ChartsUtils';
import AlertUtils from 'utils/AlertUtils';
import DeploymentsActions from 'actions/DeploymentsActions';
import ServicesActions from 'actions/ServicesActions';
import BaseApi from 'api/BaseApi';

const { PropTypes } = React;
const {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  list: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
  },
  chart: {
    backgroundColor: Colors.WHITE,
    borderColor: Colors.BORDER,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  chartIcon: {
    width: 45, height: 45,
    alignSelf: 'center',
  },
  chartTexts: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
  chartSubtitle: {
    marginTop: 2,
    fontSize: 12,
  },
  loader: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0, right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  loaderText: {
    color: Colors.WHITE,
    marginTop: 20,
  },
  deployed: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 40,
  },
  deployedImage: {
    width: 50, height: 50,
    resizeMode: 'contain',
    tintColor: Colors.GREEN,
    marginBottom: 20,
  },
  deployedTitle: {
    color: Colors.GRAY,
    fontSize: 20,
  },
});

export default class DeployClusters extends Component {

  static propTypes = {
    chart: PropTypes.instanceOf(Immutable.Map).isRequired,
    clusters: PropTypes.instanceOf(Immutable.List).isRequired,
  }

  constructor() {
    super();
    this.state = {
      loading: false,
      deployed: false,
      loadingMessage: '',
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (!nextState.loading && this.state.loadingMessage) {
      this.setState({loadingMessage: ''});
    }
  }

  render() {
    const { chart } = this.props;
    const file = chart.get('chartfile');
    return (
      <View style={styles.container}>
        <ScrollView style={styles.list} contentContainerStyle={styles.content}>
          <ListHeader title={intl('chart')} />
          <View style={styles.chart}>
            <Image style={styles.chartIcon} source={ChartsUtils.iconForChart(file.get('name'))}/>
            <View style={styles.chartTexts}>
              <Text style={styles.chartTitle} numberOfLines={2}>{file.get('name')}</Text>
              <Text style={styles.chartSubtitle} numberOfLines={2}>{file.get('description')}</Text>
            </View>
          </View>
          {!this.state.deployed && <ListHeader title={intl('deploy_choose_cluster')} />}
          {this.renderClusters()}
          {this.renderDeploySuccess()}
        </ScrollView>
        {this.state.loading &&
          <View style={styles.loader}>
            <ActivityIndicator color={Colors.WHITE} size="large"/>
            <Text style={styles.loaderText}>{this.state.loadingMessage}</Text>
          </View>
        }
      </View>
    );
  }

  renderClusters() {
    if (this.state.deployed) { return false; }
    const { clusters } = this.props;
    return clusters.map((cluster, i) => {
      return (
        <ListItem
          key={i}
          title={cluster.get('name')}
          subtitle={cluster.get('url')}
          showArrow={true}
          onPress={() => this.chooseCluster(cluster)}
          isLast={i === clusters.size - 1}/>
      );
    });
  }

  renderDeploySuccess() {
    if (!this.state.deployed) { return false; }
    return (
      <View style={styles.deployed}>
        <Image style={styles.deployedImage} source={require('images/done_circle.png')}/>
        <Text style={styles.deployedTitle}>{intl('deploy_success_title')}</Text>
      </View>
    );
  }

  chooseCluster(cluster) {
    this.setState({loading: true, loadingMessage: intl('deploy_loading_deployments')});
    DeploymentsActions.fetchDeployments(cluster).then(dps => {
      const tillerDP = dps && dps.find(dp => dp.getIn(['metadata', 'name']) === 'tiller-deploy');
      if (!tillerDP) {
        this.setState({loading: false});
        return new Promise((resolve, reject) => {
          Alert.alert(intl('deploy_no_tiller_dp_alert_title'), intl('deploy_no_tiller_dp_alert_subtitle'),
          [{text: intl('cancel')}, {text: intl('ok'), onPress: () => {
            this.createTillerDeploy(cluster).then(deployment => {
              return this.createTillerSVC({cluster, deployment});
            }).catch(e => {
              reject(e);
            })
            .then(service => resolve(service));
          }}]);
        });
      }
      return this.findService({cluster, deployment: tillerDP});
    }).then(service => {
      this.setState({loading: true, loadingMessage: intl('deploy_loading_deploy_chart')});
      return BaseApi.deployChart({chart: this.props.chart, service, cluster});
    }).then(() => {
      this.setState({deployed: true});
    }).catch(e => {
      AlertUtils.showError({message: e.message});
    }).finally(() => this.setState({loading: false}));
  }

  findService({cluster, deployment}) {
    this.setState({loading: true, loadingMessage: intl('deploy_loading_service')});
    return ServicesActions.fetchServices(cluster).then(svcs => {
      const tillerSVC = svcs && svcs.find(svc => svc.getIn(['metadata', 'labels', 'run']) === deployment.getIn(['metadata', 'name']));
      if (!tillerSVC) {
        this.setState({loading: false});
        return new Promise(resolve => {
          Alert.alert(intl('deploy_no_tiller_svc_alert_title'), intl('deploy_no_tiller_svc_alert_subtitle'),
          [{text: intl('cancel')}, {text: intl('ok'), onPress: () => this.createTillerSVC({cluster, deployment}).then(service => resolve(service))}]);
        });
      }
      return tillerSVC;
    });
  }

  createTillerDeploy(cluster) {
    this.setState({loading: true, loadingMessage: intl('deploy_loading_create_deploy')});
    return DeploymentsActions.createDeployment({
      cluster,
      name: 'tiller-deploy',
      image: 'gcr.io/kubernetes-helm/tiller:canary',
      namespace: 'default',
    });
  }

  createTillerSVC({cluster, deployment}) {
    this.setState({loading: true, loadingMessage: intl('deploy_loading_create_service')});
    return ServicesActions.createService({cluster, deployment, type: 'NodePort', port: 44134, name: deployment.getIn(['metadata', 'name'])});
  }
}
