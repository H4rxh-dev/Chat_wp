import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const Started = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ User is logged in:", user.uid);
        navigation.replace("Mainstack");
      } else {
        console.log("👤 No user found");
        navigation.replace("Authnavigation");
      }
    });

    // Cleanup auth listener (optional)
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom > 0 ? insets.bottom : verticalScale(20),
        },
      ]}
    >
      <View style={styles.content}>
        <Image
          source={require('../assets/Chats.jpeg')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.imageText}>
          Connected Together with{"\n"}Your Friends
        </Text>

        <Text style={styles.title}>
          Make it easy to connect with{"\n"}each other and send messages or{"\n"}call quickly and easily.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Started;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: scale(24),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: verticalScale(20),
  },
  image: {
    width: scale(220),
    height: verticalScale(220),
  },
  imageText: {
    fontSize: moderateScale(23),
    color: '#112f63',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: scale(10),
  },
  title: {
    fontSize: moderateScale(12),
    color: '#4a4a4a',
    textAlign: 'center',
    lineHeight: verticalScale(24),
    paddingHorizontal: scale(10),
  },
});
