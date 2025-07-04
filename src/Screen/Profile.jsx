import React, { useState, useCallback, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Switch,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import { Themecontext } from '../Context/Themecontext';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const Profile = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [email, setemail] = useState('');
  const [pass, setpass] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const currentUser = auth().currentUser;
  const { isDark, toggletheme } = useContext(Themecontext);

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
          if (userDoc.exists) {
            setUserData(userDoc.data());
          } else {
            console.log('⚠️ No user data found');
          }
        } catch (err) {
          console.error('❌ Error fetching user data:', err);
        }
      };
      fetchUser();
    }, [currentUser?.uid])
  );

  const handleLogout = async () => {
    try {

      const credential = auth.EmailAuthProvider.credential(email, pass);
      await currentUser.reauthenticateWithCredential(credential);
      await firestore().collection('users').doc(currentUser.uid).delete();
      await currentUser.delete();
      navigation.navigate('Authnavigation');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const toggleThemeWithToast = () => {
    toggletheme();
    Toast.show({
      type: 'success',
      text1: isDark ? 'Light mode enabled' : 'Dark mode enabled',
      visibilityTime: 1000,
   
    });
  };

  const handleComingSoon = () => {
    Toast.show({
      type: 'info',
      text1: 'Adding Soon',
      text2: 'This feature will be available soon 🚀',
      visibilityTime: 1000,
    });
  };


const goBack = () => {
  navigation.goBack();
};

const swipeBack = Gesture.Pan()
  .onEnd((e) => {
    if (e.translationX > 50) {
      runOnJS(goBack)(); // Right swipe
    }
  });



  return (

    <GestureDetector gesture={swipeBack}>


    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      <ScrollView
        contentContainerStyle={{
          ...styles.content,
          paddingTop: insets.top + verticalScale(10),
          paddingBottom: insets.bottom + verticalScale(20),
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.replace("User")}>
            <Ionicons name="arrow-back-outline" size={scale(25)} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: isDark ? '#fff' : '#000' }]}>Profile</Text>
          <View style={{ width: scale(25) }} />
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Image
            source={
              userData?.photoURL
                ? { uri: userData.photoURL }
                : require('../assets/Chats.jpeg')
            }
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: isDark ? '#fff' : '#000' }]}>
            {userData?.name || 'User'}
          </Text>
          <Text style={[styles.tagline, { color: isDark ? '#ccc' : '#666' }]}>
            {userData?.mail || currentUser.email || 'Email not found'}
          </Text>
        </View>

        {/* Options */}
        <View style={[styles.options, { backgroundColor: isDark ? '#1c1c1c' : '#fff' }]}>
          <TouchableOpacity onPress={() => navigation.navigate("User")} style={styles.option}>
            <Ionicons name="document-text-outline" size={scale(22)} color={isDark ? "#fff" : "#000"} />
            <Text style={[styles.optionText, { color: isDark ? '#fff' : '#000' }]}>Chats</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Blockeduser")} style={styles.option}>
            <Ionicons name="ban" size={scale(22)} color={isDark ? "#fff" : "#000"} />
            <Text style={[styles.optionText, { color: isDark ? '#fff' : '#000' }]}>Blocklist</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleThemeWithToast} style={styles.option}>
            <Switch
              value={isDark}
              onValueChange={toggleThemeWithToast}
              thumbColor={isDark ? 'white' : '#f4f3f4'}
              trackColor={{ false: '#ccc', true: '#88c3fd' }}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.optionText, { color: isDark ? '#fff' : '#000' }]}>Dark Mode</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleComingSoon} style={styles.option}>
            <Ionicons name="settings-outline" size={scale(22)} color={isDark ? "#fff" : "#000"} />
            <Text style={[styles.optionText, { color: isDark ? '#fff' : '#000' }]}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={() => setShowModal(true)}>
            <Ionicons name="log-out-outline" size={scale(22)} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal */}
      {showModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: isDark ? '#fff' : '#fff' }]}>
            <Text style={{ fontSize: moderateScale(18), marginBottom: verticalScale(10), color: isDark ? "black" : '#000' }}>
              Enter Email & Password
            </Text>
            <TextInput
              placeholder="Email"
              placeholderTextColor={isDark ? '#aaa' : 'black'}
              style={[styles.input, { color: isDark ? 'black' : '#000', borderBottomColor: isDark ? '#aaa' : '#000' }]}
              value={email}
              onChangeText={setemail}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor={isDark ? '#aaa' : 'black'}
              style={[styles.input, { color: isDark ? 'black' : '#000', borderBottomColor: isDark ? '#aaa' : '#000' }]}
              value={pass}
              onChangeText={setpass}
            />
            <TouchableOpacity
              onPress={async () => {
                setShowModal(false);
                await handleLogout();
              }}
              style={styles.confirmButton}
            >
    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Confirm Delete</Text>
              </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
    </GestureDetector>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: scale(25),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(30),
  },
  headerText: {
    fontSize: moderateScale(22),
    fontWeight: '600',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  avatar: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    marginBottom: verticalScale(12),
    borderWidth: scale(2),
    borderColor: '#88c3fd',
  },
  name: {
    fontSize: moderateScale(20),
    fontWeight: '600',
  },
  tagline: {
    fontSize: moderateScale(14),
    marginTop: verticalScale(4),
  },
  options: {
    borderRadius: moderateScale(12),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(10),
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    gap: scale(20),
  },
  optionText: {
    fontSize: moderateScale(16),
  },
  logoutContainer: {
    marginTop: verticalScale(30),
    paddingHorizontal: scale(35),
  },
logoutButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#88c3fd',
  paddingVertical: verticalScale(12),
  paddingHorizontal: scale(16),
  borderRadius: moderateScale(10),
  gap: scale(8),
},
  logoutText: {
    fontSize: moderateScale(16),
    color: '#fff',
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    padding: scale(20),
    borderRadius: moderateScale(10),
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: verticalScale(15),
  },
  confirmButton: {
    backgroundColor: '#88c3fd',
    padding: scale(12),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  }
});
