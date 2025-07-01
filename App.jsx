import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Stacknavigation from './src/Navigation/Stacknavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { BlockProvider } from './src/Context/Blockcontext';
const App = () => {
 
 
  return (
<>
<SafeAreaProvider>
  <BlockProvider>
<Stacknavigation/>
   <Toast />

  </BlockProvider>
</SafeAreaProvider>
</>
  )}

export default App

const styles = StyleSheet.create({})