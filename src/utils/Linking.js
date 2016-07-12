import ReactNative from 'react-native';
import SafariView from 'react-native-safari-view';

const { Linking } = ReactNative;


export default class LinkingUtils {

  static openURL(url, openApp) {
    if (openApp || !url.match(/^http(s?):\/\//)) {
      Linking.openURL(url);
      return;
    }
    SafariView.isAvailable().then((available) => {
      if (available) {
        SafariView.show({url});
      } else {
        Linking.openURL(url);
      }
    });
  }
}
