import { StyleSheet, Text, View,StatusBar} from 'react-native'
import React, { useEffect } from 'react'
import Stacknavigation from './src/Navigation/Stacknavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { BlockProvider } from './src/Context/Blockcontext';
// import { requestSMSPermissions } from './src/util/Smsreciver';
import { Theeprovider } from './src/Context/Themecontext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const App = () => {
 

// useEffect(() => {
//   requestSMSPermissions().then((res) => {
//     console.log("📲 Permissions granted:", res);
//   });
//   console.log("📢 Running initial effect");
// }, []); // <== Missing this earlier

 
return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <Theeprovider>
        <BlockProvider>
          <Stacknavigation />
          <Toast />
        </BlockProvider>
      </Theeprovider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);
}

export default App

const styles = StyleSheet.create({})