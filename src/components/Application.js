import Navigator from 'components/commons/Navigator';
import TabBar from 'components/commons/TabBar';

export default class Application extends Component {

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
