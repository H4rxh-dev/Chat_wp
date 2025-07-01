import React, { useState, useCallback, useEffect } from 'react';
import { Image, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

const Chatbot = () => {
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
       
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, newMessages)
        );

        const userMessage = newMessages[0].text;  // ← "Hello AI"
        console.log("userkmssage ======>", userMessage)

    }, []);
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Header */}
            <View
                style={{
                    paddingVertical: 15,
                    backgroundColor: '#f5f7fb',
                    borderBottomWidth: 0.5,
                    borderBottomColor: 'gray',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 20,
                    paddingHorizontal: 20,
                }}
            >
                <Image
                    source={require('../assets/robo.jpg')}
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                    resizeMode="contain"
                />
                <Text style={{ color: 'black', fontSize: 18, fontWeight: '500' }}>Chat with AI</Text>
            </View>

            {/* GiftedChat */}
            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: 1, // user ID for you (the sender)
                }}
                renderAvatar={null} // optional: hide avatar of current user
            />
        </View>
    );
};

export default Chatbot;

const styles = StyleSheet.create({});
