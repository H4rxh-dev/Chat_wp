import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import User from '../Screen/User';
import Profile from '../Screen/Profile';
import Chatscreen from '../Screen/Chatscreen';
import Userinfo from '../Screen/Userinfo';
import Chatbot from '../Screen/Chatbot';
import Blockeduser from '../Screen/Blockeduser';
import Smslog from '../Screen/Smslog';

const Mainstack = () => {
    const Stack = createNativeStackNavigator();
    
  return (
       <Stack.Navigator   screenOptions={{
    headerShown: false,
    animation: "slide_from_right", 
  }}
>
      <Stack.Screen name="User" component={User} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Chatscreen" component={Chatscreen} />
      <Stack.Screen name="Userinfo" component={Userinfo} />
      <Stack.Screen name="Chatbot" component={Chatbot} />
      <Stack.Screen name="Blockeduser" component={Blockeduser} />
      <Stack.Screen name="Smslog" component={Smslog} />

    </Stack.Navigator>



)
}

export default Mainstack

const styles = StyleSheet.create({})