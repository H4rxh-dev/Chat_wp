// src/context/BlockContext.js
import React, { createContext, useContext, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';

const BlockContext = createContext();

export const BlockProvider = ({ children }) => {
  const [isBlocked, setIsBlocked] = useState(false);


const blockUser = async (targetUserId) => {
  const currentUserId = auth().currentUser.uid;

  try {
    await firestore()
      .collection('users')
      .doc(currentUserId)
      .collection('blockedUsers')
      .doc(targetUserId)
      .set({ blockedAt: firestore.FieldValue.serverTimestamp() });
 setIsBlocked(true); // 👈 U
    Toast.show({ type: 'success', text1: 'User Blocked' });
  } catch (err) {
    console.error('Error blocking user:', err);
    Toast.show({ type: 'error', text1: 'Failed to block user' });
  }
};

const unblockUser = async (targetUserId) => {
  const currentUserI = auth().currentUser.uid;

  try {
    await firestore()
      .collection('users')
      .doc(currentUserI)
      .collection('blockedUsers')
      .doc(targetUserId)
      .delete();

    setIsBlocked(false); // 👈 update state
    Toast.show({ type: 'success', text1: 'User Unblocked' });
  } catch (err) {
    console.error('Error unblocking user:', err);
    Toast.show({ type: 'error', text1: 'Failed to unblock user' });
  }
};

  return (
    <BlockContext.Provider value={{ blockUser, unblockUser,isBlocked,setIsBlocked }}>
      {children}
    </BlockContext.Provider>
  );
};

export const useBlock = () => useContext(BlockContext);
