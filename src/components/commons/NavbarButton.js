import Colors from 'styles/Colors';

const { PropTypes } = React;
const {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
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
  text: {
    color: Colors.WHITE,
    fontSize: 17,
  },
});

class NavbarButton extends Component {

  static propTypes = {
    onPress: PropTypes.func.isRequired,
    title: PropTypes.string,
    source: Image.propTypes.source,
  };

  render() {
    const { title, source } = this.props;
    return (
      <TouchableOpacity onPress={this.props.onPress} style={styles.container}>
        {title && <Text style={[styles.text, this.props.style]}>{title}</Text>}
        {source && <Image source={source} style={[styles.image, this.props.style]} />}
      </TouchableOpacity>
    );
  }

}

export default NavbarButton;
