import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Signup from '../Screen/Signup'
import Login from '../Screen/Login'

const Authnavigation = () => {
    const Stack=createNativeStackNavigator()
  return (
 <Stack.Navigator screenOptions={{ headerShown: false }}>
<Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />
      
    </Stack.Navigator>  )
}

export default Authnavigation

const styles = StyleSheet.create({})