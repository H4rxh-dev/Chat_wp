import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Themecontext } from '../Context/Themecontext';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const Smslog = () => {
  const [smsLogs, setSmsLogs] = useState([]);
  const insets = useSafeAreaInsets();
  const { isDark } = useContext(Themecontext);

  const loadLogs = async () => {
    try {
      const logs = await AsyncStorage.getItem('SMS_LOGS');
      if (logs !== null) {
        setSmsLogs(JSON.parse(logs));
      } else {
        setSmsLogs([]);
      }
    } catch (error) {
      console.error('❌ Error loading SMS logs:', error);
    }
  };

  const addDummyLog = async () => {
    try {
      const dummy = {
        sender: 'TestSender',
        body: 'Hello from dummy',
        timestamp: Date.now(),
      };
      const oldLogs = JSON.parse(await AsyncStorage.getItem('SMS_LOGS')) || [];
      const newLogs = [dummy, ...oldLogs];
      await AsyncStorage.setItem('SMS_LOGS', JSON.stringify(newLogs));
      setSmsLogs(newLogs);
      Alert.alert('✅ Dummy SMS Added!');
    } catch (e) {
      Alert.alert('❌ Failed to add dummy');
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <SafeAreaView style={[
      styles.container,
      {
        paddingTop: insets.top + verticalScale(28),
        backgroundColor: isDark ? '#121212' : '#fff',
      }
    ]}>
      <Text style={[styles.heading, { color: isDark ? '#fff' : '#000' }]}>📩 SMS Logs</Text>

      <FlatList
        data={smsLogs}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: isDark ? '#aaa' : '#000' }]}>
            No SMS logs found.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: verticalScale(120) }}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBox,
            { backgroundColor: isDark ? '#1e1e1e' : '#f1f1f1' }
          ]}>
            <Text style={[styles.sender, { color: isDark ? '#fff' : '#000' }]}>
              From: {item.sender}
            </Text>
            <Text style={[styles.body, { color: isDark ? '#ddd' : '#333' }]}>
              Message: {item.body}
            </Text>
            <Text style={[styles.time, { color: isDark ? '#999' : '#666' }]}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
        )}
      />

      <View style={[styles.buttonGroup, { marginBottom: insets.bottom }]}>
        <Button title="🔄 Refresh Logs" onPress={loadLogs} />
        <View style={{ height: verticalScale(10) }} />
        <Button title="➕ Add Dummy SMS" onPress={addDummyLog} />
      </View>
    </SafeAreaView>
  );
};

export default Smslog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  heading: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginBottom: verticalScale(16),
  },
  emptyText: {
    fontSize: moderateScale(14),
    textAlign: 'center',
    marginTop: verticalScale(20),
  },
  messageBox: {
    padding: scale(12),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(12),
  },
  sender: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  body: {
    marginTop: verticalScale(4),
    fontSize: moderateScale(13),
  },
  time: {
    marginTop: verticalScale(6),
    fontSize: moderateScale(11),
  },
  buttonGroup: {
    marginTop: verticalScale(16),
    padding: scale(20),
  },
});
