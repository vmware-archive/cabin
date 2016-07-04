import Colors from 'styles/Colors';

const {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} = ReactNative;

const { PropTypes } = React;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: 50,
    paddingLeft: 15,
    paddingRight: 20,
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
  },
  left: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    paddingVertical: 15,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 11,
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: '400',
  },
  arrow: {
    width: 10,
    height: 10,
    marginLeft: 7,
    marginTop: 6,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: '#c7c7cc',
    transform: [{
      rotate: '45deg',
    }],
  },
  separator: {
    position: 'absolute',
    bottom: 0, left: 15, right: 0,
    height: 1,
    backgroundColor: Colors.BORDER,
  },
});

export default class ListItem extends Component {

  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    detailTitle: PropTypes.string,
    showSeparator: PropTypes.bool,
    showArrow: PropTypes.bool,
  }

  static defaultProps = {
    showSeparator: true,
  }
  render() {
    return (
      <TouchableOpacity style={styles.item} onPress={this.props.onPress}>
        <View style={styles.left}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{this.props.title}</Text>
            {this.props.subtitle && <Text style={styles.subtitle}>{this.props.subtitle}</Text>}
          </View>
        </View>
        <View style={styles.right}>
          {this.props.detailTitle && <Text style={styles.detailTitle}>{this.props.detailTitle}</Text>}
          {this.props.showArrow && <View style={styles.arrow}/>}
        </View>
        {this.props.showSeparator && <View style={styles.separator}/>}
      </TouchableOpacity>
    );
  }

}
