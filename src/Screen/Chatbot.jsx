import React, { useState, useCallback, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Chatbot = ({ navigation }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello! How can I assist you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'AI Bot',
          avatar: require('../assets/robo.jpg'),
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages = []) => {
    setMessages((prevMessages) =>
      GiftedChat.append(prevMessages, newMessages)
    );

    const userMessage = newMessages[0].text;
    console.log('User Message:', userMessage);

    // You can add AI response logic here
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Image
          source={require('../assets/robo.jpg')}
          style={styles.avatar}
          resizeMode="cover"
        />
        <Text style={styles.title}>Chat with AI</Text>
      </View>

      {/* Chat */}
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: 1 }}
        renderAvatar={null}
        renderUsernameOnMessage={false}
      />

      {/* Optional Keyboard Avoiding View */}
      {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />}
    </View>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f5f7fb',
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 12,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
