import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Stacknavigation from './src/Navigation/Stacknavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
const App = () => {
 
 
  return (
<>
<SafeAreaProvider>
<Stacknavigation/>
   <Toast />
</SafeAreaProvider>
</>
  )}

export default App

const styles = StyleSheet.create({})