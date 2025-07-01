import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useFocusEffect } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Blockeduser = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [blockuser, setblockuser] = useState([]);

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
console.log("blockdoc",blockDoc)
          const users = blockDoc.docs.map(doc => ({
            id: doc.id,
            name: doc.id, // Replace with actual name if stored in document
          }));

          console.log('✅ Blocked Users:', users);
          setblockuser(users);
        } catch (err) {
          console.error('Error fetching blocked users:', err);
        }
      };

      checkIfBlocked();
    }, [])
  );

  console.log('blockdeuser',blockuser)

  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.avatar}>
        <Icon name="person" size={scale(24)} color="#fff" />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userMessage}>Blocked</Text>
      </View>
      <TouchableOpacity>
        <Icon name="block" size={scale(20)} color="#ff4d4d" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back-ios" size={moderateScale(20)} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Blocked Users</Text>
        <Text style={styles.countText}>Total: {blockuser.length}</Text>
      </View>

      <FlatList
        data={blockuser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderUser}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>You haven't blocked anyone yet.</Text>
        }
      />
    </SafeAreaView>
  );
};

export default Blockeduser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(20),
    backgroundColor: '#f0f4f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#333',
  },
  countText: {
    fontSize: moderateScale(16),
    color: '#666',
  },
  listContent: {
    paddingVertical: verticalScale(10),
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    backgroundColor: '#fff',
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
    color: '#222',
  },
  userMessage: {
    fontSize: moderateScale(14),
    color: '#777',
    marginTop: verticalScale(2),
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginLeft: scale(76),
  },
  emptyText: {
    textAlign: 'center',
    fontSize: moderateScale(14),
    color: '#aaa',
    marginTop: verticalScale(40),
  },
  backButton: {
    paddingRight: scale(10),
  },
});
