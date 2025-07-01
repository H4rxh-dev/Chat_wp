import { ActivityIndicator, Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { generateChatId } from '../util/chatid'; // Make sure this works
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useBlock } from '../Context/Blockcontext';


const ChatScreen = ({ route, navigation }) => {
  const { user } = route.params;
  const currentUser = auth().currentUser;
  const chatId = generateChatId(currentUser.uid, user.id);
const { blockUser, unblockUser ,isBlocked,setIsBlocked} = useBlock();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState([]);
    const [showModal, setShowModal] = useState(false);
   const [visible, setVisible] = useState(false);
  const toggleModal = () => setVisible(!visible);
    const targetUserId = user.id;  // 👈 Th
  // const [isBlocked, setIsBlocked] = useState(false);
  const [loadingBlockStatus, setLoadingBlockStatus] = useState(true);

  useEffect(() => {
    checkIfBlocked();
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('message')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          const fetchedMessages = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              _id: doc.id,
              text: data.text,
              createdAt: data.createdAt?.toDate() || new Date(),
              user: {
                _id: data.senderId,
                name: data.senderName,
                avatar: data.senderAvatar,
              },
            };
          });
          setMessages(fetchedMessages);
        },
        error => console.error('❌ Error fetching messages:', error)
      );

    return () => unsubscribe();
  }, [chatId]);

const checkIfBlocked = async () => {
  try {
    const currentUserId = auth().currentUser.uid;

    const blockDoc = await firestore()
      .collection('users')
      .doc(currentUserId)
      .collection('blockedUsers')
      .doc(targetUserId)
      .get();

    setIsBlocked(blockDoc.exists); // ✅ true if blocked
  } catch (err) {
    console.error('Error checking block status:', err);
  }finally {
      setLoadingBlockStatus(false);
    }
};




const onSend = useCallback(async (newMessages = []) => {
  const msg = newMessages[0];

  try {
    // Generate a new document reference to get an ID
    const messageRef = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('message')
      .doc(); // Generates unique Firestore ID

    const generatedId = messageRef.id;

    const messageData = {
      _id: generatedId, // 👈 Save this for deletion
      text: msg.text,
      createdAt: firestore.FieldValue.serverTimestamp(),
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'Anonymous',
      senderAvatar: currentUser.photoURL || '',
    };

    const chatMetaRef = firestore().collection('chats').doc(chatId);

    await Promise.all([
      messageRef.set(messageData), // Use .set instead of .add
      chatMetaRef.set(
        {
          users: [currentUser.uid, user.id],
          lastMessage: msg.text,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      ),
    ]);
  } catch (e) {
    console.error('❌ Error sending message:', e);
  }
}, [chatId]);
// console.log("message=======>",messages)
const onLongPressMessage = (context, message) => {
  console.log(message.id)
  Alert.alert(
    'Delete Message',
    'Are you sure you want to delete this message?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
onPress: () => deleteMessage(message._id),
      },
    ],
    { cancelable: true }
  );
};

const deleteMessage = async (messageId) => {
  try {
    await firestore()
      .collection('chats')
      .doc(chatId)
      .collection('message') // ✅ 'message' (not 'messages')
      .doc(messageId)
      .delete();

    setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
  } catch (error) {
    Alert.alert('Error deleting message', error.message);
  }
};



 const handleBlock = () => {
    blockUser(targetUserId); 
    console.log("blockedd kelaa tine male ",targetUserId)
    // 👈 You can call it just like this
  };

  const handleUnblock = () => {
    unblockUser(targetUserId); // 👈 Same here
    console.log("unblockedd kelaa tine male ",targetUserId)
 
  };

// const blockUser = async (targetUserId) => {
//   const currentUserId = auth().currentUser.uid;

//   try {
//     await firestore()
//       .collection('users')
//       .doc(currentUserId)
//       .collection('blockedUsers')
//       .doc(targetUserId)
//       .set({ blockedAt: firestore.FieldValue.serverTimestamp() });
//  setIsBlocked(true); // 👈 U
//     Toast.show({ type: 'success', text1: 'User Blocked' });
//   } catch (err) {
//     console.error('Error blocking user:', err);
//     Toast.show({ type: 'error', text1: 'Failed to block user' });
//   }
// };

// const unblockUser = async (targetUserId) => {
//   const currentUserId = auth().currentUser.uid;

//   try {
//     await firestore()
//       .collection('users')
//       .doc(currentUserId)
//       .collection('blockedUsers')
//       .doc(targetUserId)
//       .delete();

//     setIsBlocked(false); // 👈 update state
//     Toast.show({ type: 'success', text1: 'User Unblocked' });
//   } catch (err) {
//     console.error('Error unblocking user:', err);
//     Toast.show({ type: 'error', text1: 'Failed to unblock user' });
//   }
// };

  return (
    <View style={{ flex: 1, backgroundColor: 'white',}}>
      <TouchableOpacity 
      onPress={() => navigation.navigate('Userinfo', { user: user })}
      style={[styles.profileHeader, { paddingTop: insets.top + 30 }]}>
       <View style={{flexDirection:"row",alignItems:"center", gap:30}}>
        <Text style={styles.arrow} onPress={() => navigation.goBack()}>
          {'←'}
        </Text>
        <View style={styles.avatar} />
        <Text style={styles.profileName}>{user.name}</Text>

       </View>
     <TouchableOpacity onPress={toggleModal}>
                <Icon name="more-vert" size={24} color="black" />

      </TouchableOpacity>  
        
      </TouchableOpacity>
  {loadingBlockStatus ? (
 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#007bff" />
    <Text style={{ marginTop: 10 }}>Loading chat...</Text>
  </View>   
     ) : isBlocked ? (
        <View style={styles.unblockContainer}>
          <TouchableOpacity style={styles.unblockButton} onPress={handleUnblock}>
            <Text style={styles.unblockText}>Unblock User</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: currentUser.uid,
            name: currentUser.displayName || 'Me',
            avatar: currentUser.photoURL || '',
          }}
          alwaysShowSend
          showAvatarForEveryMessage={true}
          onLongPress={onLongPressMessage}
        />
      )}    
    <Modal transparent visible={visible} animationType="fade" onRequestClose={toggleModal}>
      <TouchableOpacity
        style={styles.modalBackground}
        activeOpacity={1}
        onPressOut={toggleModal}
      >
        <TouchableOpacity activeOpacity={1}>
          <View style={styles.menuContainer}>
            <TouchableOpacity  style={styles.menuItem} onPress={() => { toggleModal();
              /* your action */ }}>
              <Text>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { toggleModal(); handleBlock()}}>
              <Text>Block</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { toggleModal(); navigation.navigate('Profile') }}>
              <Text>Report</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
    
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    justifyContent: 'space-between',
    paddingTop: verticalScale(40),
    paddingBottom: verticalScale(15),
    backgroundColor: '#f0f4f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  arrow: {
    fontSize: moderateScale(34),
    fontWeight: '800',
    color: 'black',
  },
  avatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#70b9ff',
  },
  profileName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#333',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'flex-end',
    paddingTop: verticalScale(50),
    paddingRight: scale(10),
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menuContainer: {
    backgroundColor: '#fff',
    width: scale(150),
    borderRadius: scale(6),
    paddingVertical: verticalScale(8),
    elevation: 4,
  },
  menuItem: {
    padding: moderateScale(12),
  },
  unblockContainer: {
    position: 'absolute',
    bottom: verticalScale(40),
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: moderateScale(16),
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  unblockButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(32),
    borderRadius: moderateScale(8),
  },
  unblockText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
});
