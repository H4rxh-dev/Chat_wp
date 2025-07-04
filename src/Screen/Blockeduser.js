import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import React, { useState, useContext } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useFocusEffect } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Themecontext } from '../Context/Themecontext';

const Blockeduser = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [blockuser, setblockuser] = useState([]);
  const { isDark } = useContext(Themecontext);

  useFocusEffect(
    React.useCallback(() => {
      const checkIfBlocked = async () => {
        try {
          const currentUserId = auth().currentUser?.uid;
          if (!currentUserId) return;

          const blockDoc = await firestore()
            .collection('users')
            .doc(currentUserId)
            .collection('blockedUsers')
            .get();

          const users = blockDoc.docs.map(doc => ({
            id: doc.id,
            name: doc.id, // Replace with actual name if stored
          }));

          setblockuser(users);
        } catch (err) {
          console.error('Error fetching blocked users:', err);
        }
      };

      checkIfBlocked();
    }, [])
  );

  const renderUser = ({ item }) => (
    <View style={[styles.userItem, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
      <View style={styles.avatar}>
        <Icon name="person" size={scale(24)} color="#fff" />
      </View>
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: isDark ? '#fff' : '#222' }]}>{item.name}</Text>
        <Text style={[styles.userMessage, { color: isDark ? '#ccc' : '#777' }]}>Blocked</Text>
      </View>
      <TouchableOpacity>
        <Icon name="block" size={scale(20)} color="#ff4d4d" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#ffffff', paddingTop: insets.top }]}>
      <View style={[styles.header, { backgroundColor: isDark ? '#121212' : '#f0f4f8', borderBottomColor: isDark ? '#333' : '#ddd' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back-ios" size={moderateScale(20)} color={isDark ? '#fff' : '#333'} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: isDark ? '#fff' : '#333' }]}>Blocked Users</Text>
        <Text style={[styles.countText, { color: isDark ? '#aaa' : '#666' }]}>Total: {blockuser.length}</Text>
      </View>

      <FlatList
        data={blockuser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderUser}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: isDark ? '#333' : '#e0e0e0' }]} />}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: isDark ? '#777' : '#aaa' }]}>
            You haven't blocked anyone yet.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default Blockeduser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(20),
    borderBottomWidth: 1,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  countText: {
    fontSize: moderateScale(16),
  },
  listContent: {
    paddingVertical: verticalScale(10),
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
  },
  avatar: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: '#70b9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  userMessage: {
    fontSize: moderateScale(14),
    marginTop: verticalScale(2),
  },
  separator: {
    height: 1,
    marginLeft: scale(76),
  },
  emptyText: {
    textAlign: 'center',
    fontSize: moderateScale(14),
    marginTop: verticalScale(40),
  },
  backButton: {
    paddingRight: scale(10),
  },
});
