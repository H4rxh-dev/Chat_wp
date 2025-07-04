import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useBlock } from '../Context/Blockcontext';
import { Themecontext } from '../Context/Themecontext';

const Userinfo = ({ route, navigation }) => {
  const { blockUser, unblockUser, isBlocked } = useBlock();
  const { isDark } = useContext(Themecontext);

  const { user ,msg} = route.params || {
    user: {
      name: 'John Doe',
      about: 'Hey there! I am using ChatApp.',
      photoURL: 'https://placekitten.com/200/200',
    },
  };
console.log("mesg",msg)
  const showtoast = () => {
    Toast.show({
      type: 'error',
      text1: 'Adding Soon',
      text2: 'This feature will be available soon.',
      visibilityTime: 2000,
      position: 'top',
    });
  };

  const toggleBlockStatus = () => {
    if (isBlocked) {
      unblockUser(user.id);
    } else {
      blockUser(user.id);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={25} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? "#fff" : "#000" }]}>Contact Info</Text>
        <View style={{ width: 25 }} />
      </View>

      {/* Profile Image and Name */}
      <View style={styles.profileSection}>
        <Image
          source={
            user?.photoURL
              ? { uri: user.photoURL }
              : require('../assets/Chats.jpeg')
          }
          style={[styles.avatar, { borderColor: isDark ? '#88c3fd' : '#222' }]}
        />
        <Text style={[styles.name, { color: isDark ? "#fff" : "#222" }]}>{user?.name}</Text>
        <Text style={[styles.about, { color: isDark ? "#ccc" : "#666" }]}>{user.email}</Text>
      </View>

      {/* Media Section */}
      <View style={[styles.section, { borderTopColor: isDark ? '#222' : '#eee' }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? "#aaa" : "#888" }]}>Messages</Text>
        <TouchableOpacity onPress={showtoast} style={styles.mediaPreview}>
          <Ionicons name="chatbubble-outline" size={24} color={isDark ? "#ccc" : "#888"} />
          <Text style={[styles.mediaText, { color: isDark ? "#fff" : "#000" }]}>{msg.length}</Text>
          <Ionicons name="chevron-forward-outline" size={20} color={isDark ? "#ccc" : "#888"} />
        </TouchableOpacity>
      </View>

      {/* Notification Section */}
      <View style={[styles.section, { borderTopColor: isDark ? '#222' : '#eee' }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? "#aaa" : "#888" }]}>Mute Notifications</Text>
        <TouchableOpacity onPress={showtoast} style={styles.optionRow}>
          <Ionicons name="notifications-off-outline" size={24} color={isDark ? "#ccc" : "#888"} />
          <Text style={[styles.optionText, { color: isDark ? "#fff" : "#000" }]}>Off</Text>
        </TouchableOpacity>
      </View>

      {/* Encryption */}
      <View style={[styles.section, { borderTopColor: isDark ? '#222' : '#eee' }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? "#aaa" : "#888" }]}>Encryption</Text>
        <Text style={[styles.encryptionText, { color: isDark ? "#aaa" : "#666" }]}>
          Messages and calls are end-to-end encrypted. Tap to verify.
        </Text>
      </View>

      {/* Actions */}
      <View style={[styles.section, { borderTopColor: isDark ? '#222' : '#eee' }]}>
        <TouchableOpacity onPress={toggleBlockStatus} style={styles.dangerButton}>
          <Ionicons
            name="close-circle-outline"
            size={22}
            color={isBlocked ? '#4CAF50' : '#f44336'}
          />
          <Text
            style={[
              styles.dangerText,
              { color: isBlocked ? '#4CAF50' : '#f44336' },
            ]}
          >
            {isBlocked ? "Unblock" : "Block"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={showtoast} style={styles.dangerButton}>
          <Ionicons name="alert-circle-outline" size={22} color="#f44336" />
          <Text style={{color:"#f44336"

          }}>Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Userinfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderWidth: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  about: {
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
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
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  optionText: {
    fontSize: 16,
  },
  encryptionText: {
    fontSize: 13,
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
    fontWeight: '500',
  },
});
