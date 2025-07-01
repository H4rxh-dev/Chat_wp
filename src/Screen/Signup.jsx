import { StyleSheet, Text, TextInput, View ,TouchableOpacity, Alert, ActivityIndicator} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, serverTimestamp } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';

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
    // navigation.replace('Mainstack'); // Or wherever you want to go next

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

        {err !== '' && <Text style={{ color: 'red', marginTop: 10 }}>{err}</Text>}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
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
    padding: 28,
    backgroundColor: 'white',
  },
  title: {
    textAlign: 'center',
    marginTop: 90,
    fontSize: 36,
    fontWeight: '700',
    color: 'blue',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 12,
    color: 'gray',
    marginTop: 15,
  },
  inputWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 22,
    gap: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  input: {
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 0.5,
    height: 60,
    width: '95%',
    paddingHorizontal: 20,
    color: 'black',
  },
  button: {
    backgroundColor: '#3f93e8',
    padding: 13,
    borderRadius: 10,
    height: 60,
    width: '95%',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});