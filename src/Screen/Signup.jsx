import { StyleSheet, Text, TextInput, View ,TouchableOpacity, Alert, ActivityIndicator} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, serverTimestamp } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const Signup = ({navigation}) => {
const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [pass, setpass] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, seterr] = useState('');



const signUpWithEmail = async () => {
  if (!name || !email || !pass) {
    seterr('Please fill in all fields');
    return;
  }

  setLoading(true);
  seterr('');

  try {
    const userCredential = await getAuth().createUserWithEmailAndPassword(email, pass);
    const { uid } = userCredential.user;

    await userCredential.user.updateProfile({ displayName: name });

await getFirestore().collection('users').doc(uid).set({
  name,
  email,
  image: "https://www.w3schools.com/howto/img_avatar.png",
  createdAt: serverTimestamp(),
});

    Alert.alert('✅ Success', 'User signed up and saved to Firestore');
    setname("")
    setpass("")
    setemail("")
    navigation.replace('Mainstack'); // Or wherever you want to go next

  } catch (error) {
    seterr(error.message);
    console.error('❌ Signup error:', error.message);
  } finally {
    setLoading(false);
  }
};

  

  return (
      <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Sign up</Text>
        <Text style={styles.subtitle}>Create your new account</Text>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="gray"
          value={name}
          onChangeText={(text) => setname(text)}
        />

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
          // secureTextEntry
          value={pass}
          onChangeText={(text) => setpass(text)}
        />

        <TouchableOpacity onPress={signUpWithEmail}    style={styles.button}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign up</Text>
          )}
        </TouchableOpacity>

        {err !== '' && <Text style={{ color: 'red',marginTop:verticalScale(10)}}>{err}</Text>}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop:verticalScale(20) }}>
        <Text style={{ color: 'gray' }}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: '#4da6ff', fontWeight: '600' }}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Signup;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(20),
    backgroundColor: 'white',
  },
  title: {
    textAlign: 'center',
    marginTop: verticalScale(60),
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
    paddingHorizontal: scale(17),
    paddingVertical: verticalScale(22),
    gap: verticalScale(20), // only works in RN 0.71+, else use marginBottom on child
    marginTop: verticalScale(10),
    alignItems: 'center',
  },
  input: {
    borderColor: 'black',
    borderRadius: moderateScale(10),
    borderWidth: 0.5,
    height: verticalScale(55),
    width: '95%',
    paddingHorizontal: scale(15),
    color: 'black',
  },
  button: {
    backgroundColor: '#3f93e8',
    padding: scale(13),
    borderRadius: moderateScale(10),
    height: verticalScale(50),
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

