/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import SPayButton from './SPayButtonView';
import SPayBridgeModule from './SPayBridgeModule';
import { SDKEnvironment } from './SPayBridgeModule';

import {
  Alert,
  Button,
  NativeModules,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableHighlight
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      { children }
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
    <StatusBar
      barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      backgroundColor={backgroundStyle.backgroundColor}
    />
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={backgroundStyle}>
         <Section title="Setup methods:">
            <Button 
              title='Setup action'
              onPress={ setupSDK }
            />
            <Button 
              title='isReadyForSPay action'
              onPress={ isReadyForSPay }
            />
            <Button 
              title='logout'
              onPress={ logout }
            />
          </Section>
          <Section title="Auto pay method:">
            <Button 
              title='payWithBankInvoiceId action'
              onPress={ payWithBankInvoiceId }
              />
          </Section>
          <Section title="Pay without refresh token method:">
            <Button 
              title='payWithoutRefresh action'
              onPress={ payWithoutRefresh }
              />
          </Section>
          <Section title="Payment in installments with commission method:">
            <Button 
              title='payWithPartPay action'
              onPress={ payWithPartPay }
              />
          </Section>
          <Section title="Android methods:">
            <Button 
              title='checkPermissions action'
              onPress={ androidCheckPermissions }
              />
              
          </Section>
          <Section title="iOS methods:">
            <Button 
              title='setBankScheme action'
              onPress={ iosSetBankScheme }
              />
              
          </Section>
          <Section title="Native button:">
          <TouchableHighlight onPress={onPressSPayButton} underlayColor="white">
             <SPayButton onPress={ payWithPartPay } style={{
                height: 100,
                width: 112,
                paddingHorizontal: 16,
            }}
          />
          </TouchableHighlight>
         </Section>
    </ScrollView>
    </SafeAreaView>
  );
}
  

function setupSDK() {
  let testSetupParams = {
    'bnplPlan': true,
    'spasiboBonuses': true,
    'resultViewNeeded': true,
    'helpers': true,
    'needLogs': true,
    'sbp': false,
    'creditCard': true,
    'debitCard': false
  }
  let environment = SDKEnvironment.EnvironmentProd
  SPayBridgeModule.setupSDK(
    testSetupParams,
    environment,
    (errorString: string) => {
      if(errorString) {
        Alert.alert(`Error found! ${errorString}`)
      }
      Alert.alert(`setup complited`)
    }
  )
}

function isReadyForSPay() {
  SPayBridgeModule.isReadyForSPay( 
    (isReady: boolean) => {
      Alert.alert(`is ready for spay: ${isReady}`)
  })
}

function logout() {
  SPayBridgeModule.logout()
  Alert.alert('Logout - Revoked local refresh token successful')
}

function androidCheckPermissions() {
  SPayBridgeModule.androidCheckPermissions( 
    (flag: boolean, array: Array<String>) => {
      console.log(`array strings is ${array}`)
      Alert.alert(`permissions: ${flag}`)
  })
}

function iosSetBankScheme() {
  let urlString = "sbol"
  SPayBridgeModule.iosSetBankScheme(urlString)
  Alert.alert(`setBankScheme action`)
}

function payWithBankInvoiceId() {
  var requestParams = {
    'merchantLogin': 'Test shop',
    'bankInvoiceId': '12332323095123323230951233232322',
    'orderNumber': '412',
    'language': 'rus',
    'redirectUri': 'sberPayExampleapp://sberidauth',
    'apiKey': 'testApiKey'
  }

  SPayBridgeModule.payWithBankInvoiceId(
    requestParams,
    (error: any, event: string) => {
      console.log('callback payWithBankInvoiceId trigger')
      if(error) {
        console.log(`payWithBankInvoiceId error ${error}`)
        Alert.alert(`Error found! ${error}`)
      }
      console.log(`payWithBankInvoiceId event ${event}`)
      Alert.alert(`Pay with status: ${event}`)
    })
}

function payWithoutRefresh() {
  var requestParams = {
    'merchantLogin': 'Test shop',
    'bankInvoiceId': '12332323095123323230951233232322',
    'orderNumber': '412',
    'language': 'rus',
    'redirectUri': 'sberPayExampleapp://sberidauth',
    'apiKey': 'testApiKey'
  }

  SPayBridgeModule.payWithoutRefresh(
    requestParams,
    (error: any, event: string) => {
      if(error) {
        Alert.alert(`Error found! ${error}`)
      }
        Alert.alert(`Pay with status: ${event}`)
    }
  )
}

function payWithPartPay() {
  var requestParams = {
    'merchantLogin': 'Test shop',
    'bankInvoiceId': '12332323095123323230951233232322',
    'orderNumber': '412',
    'language': 'rus',
    'redirectUri': 'sberPayExampleapp://sberidauth',
    'apiKey': 'testApiKey'
  }

  SPayBridgeModule.payWithPartPay(
    requestParams,
    (error: any, event: string) => {
      if(error) {
        Alert.alert(`Error found! ${error}`)
      }
        Alert.alert(`Pay with status: ${event}`)
    }
  )
}

function onPressSPayButton() {
  Alert.alert('Button pressed')
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
