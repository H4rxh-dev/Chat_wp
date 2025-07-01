import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Authnavigation from './Authnavigation';
import Mainstack from './Mainstack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Started from '../Screen/Started';

const Stacknavigation = () => {

const Stack = createNativeStackNavigator();

  return (
  <NavigationContainer>
     <Stack.Navigator screenOptions={{headerShown:false,
    headerShown: false,
    animation: 'slide_from_right', // or 'fade', 'slide_from_left', 'slide_from_bottom', 'none'
     }}>
      <Stack.Screen name="Started" component={Started} />

      <Stack.Screen name="Authnavigation" component={Authnavigation} />
      <Stack.Screen name="Mainstack" component={Mainstack} />

    </Stack.Navigator>
    
    
      </NavigationContainer>
      
    )
}

export default Stacknavigation

const styles = StyleSheet.create({})