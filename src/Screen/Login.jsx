import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from '@react-native-firebase/auth';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const Login = ({navigation}) => {

  const [email, setemail] = useState('');
  const [pass, setpass] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, seterr] = useState('');
const loginWithEmail = async () => {
    if (!email || !pass) {
      Alert.alert("Please fill all fields");
      return;
    }

    setLoading(true);
    seterr('');

    try {
      const auth = getAuth();
      const userCredential = await auth.signInWithEmailAndPassword(email, pass);
      const user = userCredential.user;
      console.log('✅ User logged in:', user.uid);
      Alert.alert("Welcome!", `Hello ${user.displayName || 'User'}`);
      // Navigate to home/chat screen
      navigation.replace('Mainstack'); // <-- Change this to your main screen
    } catch (error) {
      console.error('❌ Login error:', error.message);
      if(error.message){
        seterr("PLease provide an proper email and password to login")
      }
    } finally {
      setLoading(false);
    }
  };
  return (

    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Welcome back! Please log in</Text>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          placeholderTextColor="gray"
          value={email}
          onChangeText={(text) => setemail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your Password"
          placeholderTextColor="gray"
          value={pass}
          onChangeText={(text) => setpass(text)}
        />

        <TouchableOpacity  onPress={loginWithEmail} style={styles.button}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        {err !== '' && <Text style={{ color: 'red', marginTop: 10 }}>{err}</Text>}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
        <Text style={{ color: 'gray' }}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={{ color: '#4da6ff', fontWeight: '600' }}>Signup</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
 container: {
    flex: 1,
    padding: scale(28),
    backgroundColor: 'white',
  },
  title: {
    textAlign: 'center',
    marginTop: verticalScale(90),
    fontSize: moderateScale(36),
    fontWeight: '700',
    color: 'blue',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: moderateScale(12),
    color: 'gray',
    marginTop: verticalScale(15),
  },
  inputWrapper: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(22),
    marginTop: verticalScale(20),
    gap: verticalScale(20), // Only works RN 0.71+, else use marginBottom on children
    alignItems: 'center',
  },
  input: {
    borderColor: 'black',
    borderRadius: moderateScale(10),
    borderWidth: 0.5,
    height: verticalScale(55),
    width: '95%',
    paddingHorizontal: scale(20),
    color: 'black',
  },
  button: {
    backgroundColor: '#3f93e8',
    padding: scale(13),
    borderRadius: moderateScale(10),
    height: verticalScale(60),
    width: '95%',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});