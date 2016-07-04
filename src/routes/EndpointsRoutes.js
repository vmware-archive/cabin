import Endpoints from 'components/Endpoints';
import NavbarButton from 'components/commons/NavbarButton';

export default {
  getEndpointsIndexRoute() {
    return {
      name: 'EndpointsIndex',
      statusBarStyle: 'light-content',
      getTitle: () => 'Endpoints',
      renderScene(navigator) {
        return <Endpoints navigator={navigator} />;
      },
      renderRightButton() {
        return (
          <NavbarButton source={require('images/add.png')} />
        );
      },
    };
  },
};
