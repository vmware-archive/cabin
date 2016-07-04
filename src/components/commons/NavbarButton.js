import Colors from 'styles/Colors';

const { PropTypes } = React;
const {
  Image,
  StyleSheet,
  TouchableOpacity,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    tintColor: Colors.WHITE,
    width: 20, height: 20,
  },
});

class NavbarButton extends Component {

  static propTypes = {
    onPress: PropTypes.func.isRequired,
    ...Image.propTypes,
  };

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={styles.container}>
        <Image {...this.props} style={[styles.image, this.props.style]} />
      </TouchableOpacity>
    );
  }

}

export default NavbarButton;
