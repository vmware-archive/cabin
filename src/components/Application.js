import Navigator from 'components/commons/Navigator';
import TabBar from 'components/commons/TabBar';
import InitActions from 'actions/InitActions';

export default class Application extends Component {

  componentDidMount() {
    InitActions.initializeApplication();
  }

  render() {
    return (
      <Navigator
        navigatorEvent="application:navigation"
        showNavigationBar={false}
        sceneStyle={{paddingTop: 0}}
        initialRoute={{
          statusBarStyle: 'light-content',
          renderScene() {
            return <TabBar />;
          },
        }}
      />
    );
  }
}
