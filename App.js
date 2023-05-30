/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Alert, Button, TextInput, View, Text, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';

const App = () => {
  // If null, no SMS has been sent
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const [verificationDone, setVerificationDone] = useState(false);

  // Handle login
  const onAuthStateChanged = user => {
    try {
      if (user) {
        console.log(user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle the button press
  const signInWithPhoneNumber = async () => {
    Alert.alert('Please confirm your number', phoneNumber, [
      {
        text: 'Cancel',
        onPress: () => {
          setPhoneNumber('');
          setVerificationDone(false);
        },
        style: 'cancel',
      },
      {text: 'OK', onPress: () => signInConfirm(phoneNumber)},
    ]);
  };

  const signInConfirm = async phoneNumberValue => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumberValue);
      setConfirm(confirmation);
    } catch (error) {
      Alert.alert(
        'Error!!',
        'We have blocked all requests from this device due to unusual activity. Try again later',
        [
          {
            text: 'Cancel',
            onPress: () => {
              setPhoneNumber('');
              setVerificationDone(false);
            },
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
      );
    }
  };

  const confirmCode = async () => {
    try {
      const confirmData = await confirm.confirm(code);

      setVerificationDone(true);
      setUserDetails(confirmData.user);
    } catch (error) {
      Alert.alert('Invalid Code', 'Please Enter correct code', [
        {
          text: 'Cancel',
          onPress: () => {
            setPhoneNumber('');
            setVerificationDone(false);
          },
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    }
  };

  if (!confirm) {
    return (
      <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
        <Text>Please enter your country code. ex +919999999999</Text>
        <TextInput
          value={phoneNumber}
          style={styles.input}
          onChangeText={text => setPhoneNumber(text)}
          placeholder="Enter Phone Number, Include country code"
        />
        <Button
          title="Submit, to sign in"
          onPress={() => signInWithPhoneNumber()}
        />
      </View>
    );
  }

  return (
    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
      <TextInput
        value={code}
        style={styles.input}
        onChangeText={text => setCode(text)}
        placeholder="Enter verification code"
      />
      <Button title="Confirm Code" onPress={() => confirmCode()} />
      {verificationDone && (
        <Text>
          Authentication Success, Welcome user {userDetails?.phoneNumber}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default App;
