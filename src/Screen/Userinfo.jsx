import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useBlock } from '../Context/Blockcontext';

const Userinfo = ({ route, navigation }) => {
   const { blockUser, unblockUser ,isBlocked,setIsBlocked} = useBlock();

  const { user } = route.params || {
   
    user: {
      name: 'John Doe',
      about: 'Hey there! I am using ChatApp.',
      photoURL: 'https://placekitten.com/200/200',
    },
  };
  const showtoast=()=>{
      Toast.show({
  type: 'error',
  text1: 'adding soon',
  text2: 'adding soon.',
  visibilityTime: 3000,
  position: 'top', // or 'bottom'
});

console.log("routessssssssss",route.params)
  }

const toggleBlockStatus = () => {
  if (isBlocked) {
    unblockUser(user.id);
  } else {
    blockUser(user.id);
  }
};


  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={25} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Info</Text>
        <View style={{ width: 25 }} />
      </View>

      {/* Profile Image and Name */}
      <View style={styles.profileSection}>
<Image
  source={
    user?.photoURL
      ? { uri: user.photoURL }
      : require('../assets/Chats.jpeg') // Replace with your default image
  }
  style={styles.avatar}
/>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.about}>{user.email}</Text>
      </View>

      {/* Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Media, Links and Docs</Text>
        <TouchableOpacity onPress={showtoast} style={styles.mediaPreview}>
          <Ionicons name="image-outline" size={24} color="#888" />
          <Text style={styles.mediaText}>123 Files</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mute Notifications</Text>
        <TouchableOpacity onPress={showtoast} style={styles.optionRow}>
          <Ionicons name="notifications-off-outline" size={24} color="#888" />
          <Text style={styles.optionText}>Off</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Encryption</Text>
        <Text style={styles.encryptionText}>
          Messages and calls are end-to-end encrypted. Tap to verify.
        </Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity onPress={toggleBlockStatus} style={styles.dangerButton}>
          <Ionicons name="close-circle-outline" size={22} color={isBlocked ? '#4CAF50' : '#f44336'}/>
          <Text
  style={[
    styles.dangerText,
    { color: isBlocked ? '#4CAF50' : '#f44336' }
  ]}
>
  {isBlocked ? "Unblock" : "Block"}
</Text>

        </TouchableOpacity>

        <TouchableOpacity onPress={showtoast} style={styles.dangerButton}>
          <Ionicons name="alert-circle-outline" size={22} color="#f44336" />
          <Text style={styles.dangerText}>Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Userinfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth:2
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  about: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  mediaPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mediaText: {
    flex: 1,
    marginLeft: 10,
    color: '#000',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  encryptionText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  dangerText: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: '500',
  },
});
