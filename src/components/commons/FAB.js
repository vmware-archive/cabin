import { MKButton } from 'react-native-material-kit';
import { Text } from 'react-native';
import Colors from 'styles/Colors';

const FAB = ({ backgroundColor, onPress }) => {
  const button = MKButton.coloredFab().withBackgroundColor(backgroundColor).withOnPress(onPress);

  return (
    <MKButton
      {...button.toProps()}
      style={[button.style, {position: 'absolute', bottom: 16, right: 16, width: 56, height: 56, borderRadius: 28}]}>
      <Text style={{fontSize: 18, color: Colors.WHITE}}>+</Text>
    </MKButton>
  );
};

export default FAB;
