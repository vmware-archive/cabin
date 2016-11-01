import { Alert, AlertIOS, NativeModules, Platform } from 'react-native';

const { DialogPromptModuleAndroid: Dialog} = NativeModules;
const ExportAlert = Alert;

ExportAlert.prompt = (title, message, actions) => {
  if (Platform.OS === 'ios') {
    return AlertIOS.prompt(...arguments);
  }
  return Dialog.prompt(title, message, actions.map(a => a.text), (action, which, text) => {
    if (action !== Dialog.dismissed) {
      actions[which].onPress && actions[which].onPress(text);
    }
  });
};

export default ExportAlert;
