
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

const User = ({ navigation }) => {
  const insets = useSafeAreaInsets();


const [users, setUsers] = useState([]);
 const [visible, setVisible] = useState(false);

  const toggleModal = () => setVisible(!visible);
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const currentUserUid = getAuth().currentUser.uid;

      const snapshot = await getFirestore().collection('users').get();
console.log('====================================');
console.log("usersss=>",snapshot);
console.log('====================================');
      const userList = snapshot.docs
        .map(doc => ({
          id: doc.id, // 🔑 Store doc ID
          ...doc.data(),
        }))
        .filter(user => user.id !== currentUserUid); // ❌ Exclude current user

      setUsers(userList);
    } catch (error) {
      console.error('🔥 Error fetching users:', error);
    }
  };

  fetchUsers();
}, []);

console.log("user============>",users)
const renderUserItem = ({ item }) => (
  <View style={styles.userItem}>
    <TouchableOpacity onPress={() => navigation.navigate('Profile', { user: item })}>
      <Image source={{ uri: item.image }} style={styles.avatar} />
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.userInfo}
      onPress={() => navigation.navigate('Chatscreen', { user: item })}
    >
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userMessage} numberOfLines={1}>
        {item.message}
      </Text>
    </TouchableOpacity>
  </View>
);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chats</Text>
      <TouchableOpacity onPress={toggleModal} style={styles.dotIcon}>
        <Icon name="more-vert" size={24} color="black" />
      </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
<Modal transparent visible={visible} animationType="fade" onRequestClose={toggleModal}>
  <TouchableOpacity
    style={styles.modalBackground}
    activeOpacity={1}
    onPressOut={toggleModal}
  >
    <TouchableOpacity activeOpacity={1}>
      <View style={styles.menuContainer}>
        <TouchableOpacity  style={styles.menuItem} onPress={() => { toggleModal();
        navigation.navigate("Chatbot")
          /* your action */ }}>
          <Text>Chat With AI</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => { toggleModal(); /* your action */ }}>
          <Text>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => { toggleModal(); navigation.navigate('Profile') }}>
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </TouchableOpacity>
</Modal>

      
    </SafeAreaView>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f5f7fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
flexDirection:"row",justifyContent:"space-between"  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingVertical: 5,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  userMessage: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginLeft: 82, // align below text, not avatar
  },  modalBackground: {
    flex: 1,
    alignItems: 'flex-end',
    paddingTop: 50,
    paddingRight: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menuContainer: {
    backgroundColor: '#fff',
    width: 150,
    borderRadius: 6,
    paddingVertical: 8,
    elevation: 4,
  },
  menuItem: {
    padding: 12,
  },

});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
