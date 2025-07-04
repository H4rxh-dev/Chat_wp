import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { GiftedChat, Message } from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Themecontext } from '../Context/Themecontext';
import { COHERE_API_KEY } from '../util/apiKeys';

const Chatbot = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { isDark } = useContext(Themecontext);

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

  // const handleSend = useCallback(async (newMessages = []) => {
  //   const userMessage = newMessages[0].text;
  //   setMessages(prev => GiftedChat.append(prev, newMessages));

  //   try {
  //     setLoading(true);
  //     const res = await fetch('https://h4rxh1111.app.n8n.cloud/webhook/chatbot', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ message: userMessage }),
  //     });

  //     const text = await res.text();

  //     let data;
  //     try {
  //       data = JSON.parse(text);
  //     } catch (e) {
  //       throw new Error(`Invalid JSON from n8n: ${text}`);
  //     }

  //     const reply = data?.reply || '⚠️ Sorry, no response from AI.';

  //     const botMessage = {
  //       _id: Math.random().toString(),
  //       text: reply,
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'AI Bot',
  //         avatar: require('../assets/robo.jpg'),
  //       },
  //     };

  //     setMessages(prev => GiftedChat.append(prev, [botMessage]));
  //   } catch (err) {
  //     console.error('[Chatbot] Error:', err);
  //     setMessages(prev => GiftedChat.append(prev, [{
  //       _id: Math.random().toString(),
  //       text: '⚠️ Error getting response. Please try again later.',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'AI Bot',
  //         avatar: require('../assets/robo.jpg'),
  //       },
  //     }]));
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);
const handleSend = useCallback(async (newMessages = []) => {
  const userMessage = newMessages[0].text;
  setMessages(prev => GiftedChat.append(prev, newMessages));
  setLoading(true);

  try {
    const res = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
  'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage,
        model: "command-r-plus"
      })
    });

    const data = await res.json();
    const reply = data.text || '⚠️ No response from AI.';
console.log("data============>",data)
console.log("data============>",reply)



    const botMessage = {
      _id: Math.random().toString(),
      text: reply,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'AI Bot',
        avatar: require('../assets/robo.jpg'),
      },
    };

    setMessages(prev => GiftedChat.append(prev, [botMessage]));
  } catch (err) {
    console.error('[AI Chatbot Error]', err);
    setMessages(prev => GiftedChat.append(prev, [{
      _id: Math.random().toString(),
      text: '⚠️ Error while getting response.',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'AI Bot',
        avatar: require('../assets/robo.jpg'),
      },
    }]));
  } finally {
    setLoading(false);
  }
}, []);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      <View style={[
        styles.header,
        {
          paddingTop: insets.top + verticalScale(8),
          backgroundColor: isDark ? '#1e1e1e' : '#f5f7fb',
          borderBottomColor: isDark ? '#333' : 'gray',
        }
      ]}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Ionicons name="arrow-back-outline" size={moderateScale(24)} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Image source={require('../assets/robo.jpg')} style={styles.avatar} />
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Chat with AI</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? verticalScale(100) : 0}
      >
        <GiftedChat
          messages={messages}
          onSend={handleSend}
          user={{ _id: 1 }}
          renderAvatar={null}
          renderUsernameOnMessage={false}
          messagesContainerStyle={{
            backgroundColor: isDark ? '#121212' : '#fff',
            paddingBottom: verticalScale(10),
          }}
          renderMessage={(props) => (
            <View style={{ marginVertical: verticalScale(6) }}>
              <Message {...props} />
            </View>
          )}
        />
      </KeyboardAvoidingView>

      {loading && (
        <View style={[styles.loading, { backgroundColor: isDark ? '#222' : '#f2f2f2' }]}>
          <ActivityIndicator size="small" color={isDark ? '#fff' : '#555'} />
          <Text style={{ marginLeft: scale(10), color: isDark ? '#fff' : '#555' }}>Thinking...</Text>
        </View>
      )}
    </View>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(15),
    borderBottomWidth: 0.5,
  },
  avatar: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    marginLeft: scale(12),
    marginRight: scale(10),
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  loading: {
    position: 'absolute',
    bottom: verticalScale(10),
    left: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(8),
    borderRadius: moderateScale(16),
  },
});
