import { Image } from 'expo-image';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { auth } from '../../firebase'; // Adjust the path to your firebase.ts file
import { authStyles } from './auth.styles';



const SignUpScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={authStyles.container}>
        <Image
          style={authStyles.image}
          source={require('../../assets/images/FlightScopeLogo.png')}
          contentFit="cover"
        />
        {error && <Text style={authStyles.error}>{error}</Text>}
        <TextInput
          textColor="black"
          style={authStyles.input}
          placeholder="Email"
          value={email}
          placeholderTextColor={Colors.light.placeholder}
          onChangeText={setEmail}
          autoCapitalize="none"
          theme={{ colors: { primary: Colors.light.primary } }}
        />
        <TextInput
          textColor="black"
          style={authStyles.input}
          placeholder="Password"
          value={password}
          placeholderTextColor={Colors.light.placeholder}
          onChangeText={setPassword}
          secureTextEntry
          theme={{ colors: { primary: Colors.light.primary } }}
        />
        <Button
          style={authStyles.signUpButton}
          labelStyle={authStyles.buttonLabel}
          mode="contained"
          onPress={handleSignUp}
          buttonColor={"#050955"}>
          Sign Up
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignUpScreen;
