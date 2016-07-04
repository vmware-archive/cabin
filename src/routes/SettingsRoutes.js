import Settings from 'components/Settings';

export default {
  getSettingsIndexRoute() {
    return {
      name: 'SettingsIndex',
      statusBarStyle: 'light-content',
      getTitle: () => 'Settings',
      renderScene(navigator) {
        return <Settings navigator={navigator} />;
      },
    };
  },
};
