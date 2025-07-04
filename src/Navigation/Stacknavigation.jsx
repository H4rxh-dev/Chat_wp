import { StyleSheet, Text, View ,StatusBar} from 'react-native'
import React from 'react'
import Authnavigation from './Authnavigation';
import Mainstack from './Mainstack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Started from '../Screen/Started';
// import Smslog from '../Screen/Smslog';

const Stacknavigation = () => {

const Stack = createNativeStackNavigator();

  return (
<NavigationContainer>
  <StatusBar
    backgroundColor="#ec1f71"
    barStyle="light-content" // better contrast for pink background
    translucent={false}
  />
  
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="Started" component={Started} />
    <Stack.Screen name="Authnavigation" component={Authnavigation} />
    <Stack.Screen name="Mainstack" component={Mainstack} />
  </Stack.Navigator>
</NavigationContainer>
      
    )
}

export default Stacknavigation

const styles = StyleSheet.create({})