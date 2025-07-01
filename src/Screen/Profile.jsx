import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';

const Profile = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
    const [email, setemail] = useState('');
    const [pass, setpass] = useState('');
    
      const [loading, setLoading] = useState(false);
    
  const [showModal, setShowModal] = useState(false);

  const [userData, setUserData] = useState(null);
  const currentUser = auth().currentUser;

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
    const user = auth().currentUser;
    const uid = user.uid;

    // 🔁 Step 1: Reauthenticate
    const credential = auth.EmailAuthProvider.credential(email, pass);
    await user.reauthenticateWithCredential(credential);
    console.log('🔁 Re-authentication successful');

    await firestore().collection('users').doc(uid).delete();
    console.log('✅ Firestore document deleted');

    // 🧹 Step 3: Delete from Firebase Auth
    await user.delete();
    console.log('✅ Auth user deleted');

  
    navigation.navigate('Authnavigation');

  } catch (error) {
    console.error('❌ Error:', error.message);
    Alert.alert('Error', error.message);
  }finally{
    console.log("finallt comepleted");
  
  }
};



const handleComingSoon = () => {
  Toast.show({
    type: 'info',
    text1: 'Adding Soon',
    text2: 'This feature will be available soon 🚀',
    visibilityTime: 3000,
  });
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          ...styles.content,
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 20,
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.replace("User")}>
            <Ionicons name="arrow-back-outline" size={25} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Profile</Text>
          <View style={{ width: 25 }} />
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
          <Text style={styles.name}>{userData?.name || 'User'}</Text>
          <Text style={styles.tagline}>{userData?.mail || currentUser.email || 'Email not found'}</Text>
        </View>

       
        <View style={styles.options}>
          <TouchableOpacity onPress={()=>navigation.navigate("User")} style={styles.option}>
            <Ionicons name="document-text-outline" size={22} color="#000" />
            <Text style={styles.optionText}>Chats</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate("Blockeduser")} style={styles.option}>
            <Ionicons name="ban" size={22} color="#000" />
            <Text style={styles.optionText}>Blocklist</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleComingSoon} style={styles.option}>
            <Ionicons name="moon-outline" size={22} color="#000" />
            <Text style={styles.optionText}>Dark Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleComingSoon} style={styles.option}>
            <Ionicons name="settings-outline" size={22} color="#000" />
            <Text style={styles.optionText}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={()=>setShowModal(true)}>
            <Ionicons name="log-out-outline" size={22} color="#fff" />
            <Text style={styles.logoutText}>Logout & Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
{showModal && (
  <View style={{
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'
  }}>
    <View style={{
      width: '80%', backgroundColor: '#fff', padding: 20, borderRadius: 10
    }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Enter Email & Password</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor={"black"}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
        value={email}
        onChangeText={setemail}
      />
      <TextInput
        placeholder="Password"
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
        placeholderTextColor={"black"}

        value={pass}
        onChangeText={setpass}
      />
<TouchableOpacity
  onPress={async () => {
    setShowModal(false);
    await handleLogout(); // just call it directly
  }}
  style={{
    backgroundColor: '#88c3fd',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Confirm Delete</Text>
</TouchableOpacity>
    </View>
  </View>
)}


    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#88c3fd',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  options: {
    backgroundColor: 'white',
    borderRadius: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    gap: 20,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  logoutContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#88c3fd',
    paddingVertical: 16,
    borderRadius: 10,
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
