/*
  Copyright 2015 Skippbox, Ltd

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import Colors from 'styles/Colors';
import ListItem from 'components/commons/ListItem';
import ListHeader from 'components/commons/ListHeader';
import SettingsRoutes from 'routes/SettingsRoutes';
import SettingsActions from 'actions/SettingsActions';
import Linking from 'utils/Linking';

const {
  View,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  list: {
    flex: 1,
    // paddingTop: 20,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    height: 20, width: 20,
    resizeMode: 'contain',
    marginRight: 6,
  },
  tintColor: {
    tintColor: Colors.BLACK,
    opacity: 0.7,
  },
  twitterText: {
    fontSize: 16,
    color: Colors.BLUE,
  },
  replicasInput: {
    flex: 1,
    width: 60,
    textAlign: 'right',
  },
});

export default class Settings extends Component {

  render() {
    const maxReplicas = alt.stores.SettingsStore.getMaxReplicas();
    return (
      <View style={styles.container}>
        <ScrollView style={styles.list} keyboardDismissMode="interactive">
          <ListHeader title="Customize"/>
          <ListItem title="Object kind list" showArrow={true} onPress={() => {
            this.props.navigator.push(SettingsRoutes.getSettingsEntitiesRoute());
          }}/>
          <ListItem title="Charts stores" showArrow={true} onPress={() => {
            this.props.navigator.push(SettingsRoutes.getSettingsChartsStoresRoute());
          }}/>
          <ListItem title="Maximum number of replicas" isLast={true} onPress={() => {
            this.replicasInput && this.replicasInput.focus();
          }} renderDetail={() => {
            return (
              <TextInput ref={t => {this.replicasInput = t;}} style={styles.replicasInput}
                defaultValue={`${maxReplicas}`}
                onSubmitEditing={(e) => {
                  const value = parseInt(e.nativeEvent.text, 10);
                  if (!value || value <= 0) {
                    this.replicasInput.setNativeProps({text: `${maxReplicas}`});
                    return;
                  }
                  this.replicasInput.setNativeProps({text: `${value}`});
                  SettingsActions.updateMaxReplicas(value);
                }}
              />
            );
          }}/>

          <ListHeader style={{marginTop: 20}} title="About us"/>
          <ListItem detailTitle="v0.1.0" renderTitle={() => {
            return (
              <View style={styles.titleContainer}>
                <Image style={styles.logo} source={require('images/icon.png')}/>
                <Image style={[styles.logo, {width: 84}]} source={require('images/logo.png')}/>
              </View>
            );
          }}/>
          <ListItem detailTitle="@skippbox" onPress={() => Linking.openURL('https://twitter.com/skippbox')}
            renderTitle={() => {
              return (
                <View style={styles.titleContainer}>
                  <Image style={styles.logo} source={require('images/twitter.png')}/>
                </View>
              );
            }}/>
          <ListItem detailTitle="info@skippbox.com" onPress={() => Linking.openURL('mailto://info@skippbox.com')}
            renderTitle={() => {
              return (
                <View style={styles.titleContainer}>
                  <Image style={[styles.logo, styles.tintColor]} source={require('images/mail.png')}/>
                </View>
              );
            }}/>
          <ListItem detailTitle="www.skippbox.com" isLast={true} onPress={() => Linking.openURL('http://www.skippbox.com')}
            renderTitle={() => {
              return (
                <View style={styles.titleContainer}>
                  <Image style={[styles.logo, styles.tintColor]} source={require('images/web.png')}/>
                </View>
              );
            }}/>

          <ListHeader style={{marginTop: 20}} title="Issues"/>
          <ListItem detailTitle="Github" showArrow={true} isLast={true} onPress={() => Linking.openURL('https://github.com/skippbox/theapp/issues')}
            renderTitle={() => {
              return (
                <View style={styles.titleContainer}>
                  <Image style={[styles.logo, styles.tintColor]} source={require('images/github.png')}/>
                </View>
              );
            }}/>
        </ScrollView>
      </View>
    );
  }
}
