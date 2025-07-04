/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';

AppRegistry.registerComponent(appName, () => App);


// Headless task for background SMS
// AppRegistry.registerHeadlessTask('SMSReceiverTask', () => async ({ sender, body }) => {
//   console.log('📥 Received SMS:', sender, body);

//   try {
//     const oldLogs = JSON.parse(await AsyncStorage.getItem('SMS_LOGS')) || [];
//     const updatedLogs = [{ sender, body, timestamp: Date.now() }, ...oldLogs];
//     await AsyncStorage.setItem('SMS_LOGS', JSON.stringify(updatedLogs));
//     console.log('✅ SMS saved to AsyncStorage');
//   } catch (e) {
//     console.error('❌ Failed to save SMS:', e);
//   }
// });