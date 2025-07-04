import { ActivityIndicator, Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState, useContext } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { generateChatId } from '../util/chatid';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useBlock } from '../Context/Blockcontext';
import { Themecontext } from '../Context/Themecontext';

const ChatScreen = ({ route, navigation }) => {
  const { user } = route.params;
  const { isDark } = useContext(Themecontext);
  const currentUser = auth().currentUser;
  const chatId = generateChatId(currentUser.uid, user.id);
  const { blockUser, unblockUser, isBlocked, setIsBlocked } = useBlock();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loadingBlockStatus, setLoadingBlockStatus] = useState(true);

  const toggleModal = () => setVisible(!visible);
  const targetUserId = user.id;

  useEffect(() => {
    checkIfBlocked();
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('message')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
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
      }, error => console.error('❌ Error fetching messages:', error));

    return () => unsubscribe();
  }, [chatId]);

  const checkIfBlocked = async () => {
    try {
      const currentUserId = currentUser.uid;
      const blockDoc = await firestore()
        .collection('users')
        .doc(currentUserId)
        .collection('blockedUsers')
        .doc(targetUserId)
        .get();
      setIsBlocked(blockDoc.exists);
    } catch (err) {
      console.error('Error checking block status:', err);
    } finally {
      setLoadingBlockStatus(false);
    }
  };

  const onSend = useCallback(async (newMessages = []) => {
    const msg = newMessages[0];
    try {
      const messageRef = firestore().collection('chats').doc(chatId).collection('message').doc();
      const generatedId = messageRef.id;
      const messageData = {
        _id: generatedId,
        text: msg.text,
        createdAt: firestore.FieldValue.serverTimestamp(),
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Anonymous',
        senderAvatar: currentUser.photoURL || '',
      };

      const chatMetaRef = firestore().collection('chats').doc(chatId);
      await Promise.all([
        messageRef.set(messageData),
        chatMetaRef.set({
          users: [currentUser.uid, user.id],
          lastMessage: msg.text,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true }),
      ]);
    } catch (e) {
      console.error('❌ Error sending message:', e);
    }
  }, [chatId]);

  const onLongPressMessage = (context, message) => {
    Alert.alert('Delete Message', 'Are you sure you want to delete this message?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMessage(message._id) },
    ]);
  };

  const deleteMessage = async (messageId) => {
    try {
      await firestore().collection('chats').doc(chatId).collection('message').doc(messageId).delete();
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (error) {
      Alert.alert('Error deleting message', error.message);
    }
  };

const navigating=()=>{
   navigation.navigate('Userinfo', { user, msg: messages })
}

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#fff' }}>
      <TouchableOpacity 
        onPress={navigating}
        style={[styles.profileHeader, { paddingTop: insets.top + 30, backgroundColor: isDark ? '#1e1e1e' : '#f0f4f8' }]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <Text style={[styles.arrow, { color: isDark ? 'white' : 'black' }]} onPress={() => navigation.goBack()}>
            {'←'}
          </Text>
          <View style={styles.avatar} />
          <Text style={[styles.profileName, { color: isDark ? 'white' : '#333' }]}>{user.name}</Text>
        </View>
        <TouchableOpacity onPress={toggleModal}>
          <Icon name="more-vert" size={24} color={isDark ? 'white' : 'black'} />
        </TouchableOpacity>
      </TouchableOpacity>

      {loadingBlockStatus ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={{ marginTop: 10, color: isDark ? '#fff' : '#000' }}>Loading chat...</Text>
        </View>
      ) : isBlocked ? (
        <View style={[styles.unblockContainer, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
          <TouchableOpacity style={styles.unblockButton} onPress={() => unblockUser(targetUserId)}>
            <Text style={styles.unblockText}>Unblock User</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: currentUser.uid,
            name: currentUser.displayName || 'Me',
            avatar: currentUser.photoURL || '',
          }}
          alwaysShowSend
          showAvatarForEveryMessage
          onLongPress={onLongPressMessage}
           messagesContainerStyle={{
                      backgroundColor: isDark ? '#121212' : '#fff',
                      paddingBottom: verticalScale(10),
                    }}
       
       
                    />
      )}

      <Modal transparent visible={visible} animationType="fade" onRequestClose={toggleModal}>
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={toggleModal}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={[styles.menuContainer, { backgroundColor: isDark ? '#333' : '#fff' }]}>
              <TouchableOpacity  style={styles.menuItem} onPress={() => { toggleModal();navigating() }}>
                <Text style={{ color: isDark ? '#fff' : '#000' }}>View Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { toggleModal(); blockUser(targetUserId); }}>
                <Text style={{ color: isDark ? '#fff' : '#000' }}>Block</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { toggleModal(); navigation.navigate('Profile'); }}>
                <Text style={{ color: isDark ? '#fff' : '#000' }}>Theme</Text>
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
    paddingBottom: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  arrow: {
    fontSize: moderateScale(34),
    fontWeight: '800',
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
  },
  modalBackground: {
    flex: 1,
    alignItems: 'flex-end',
    paddingTop: verticalScale(50),
    paddingRight: scale(10),
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menuContainer: {
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
