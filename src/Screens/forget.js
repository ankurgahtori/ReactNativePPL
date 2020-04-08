import React, {useState} from 'react';
import {Text, View, TextInput, Image} from 'react-native';
import {Button} from 'react-native-elements';
import {serverURL} from '../../config/config';
import styles from './style';

const ForgetScreen = ({navigation}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [email, setEmail] = useState('');
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };
  const handleSubmit = () => {
    let obj = {
      email: email,
    };
    console.log('raghvendra tiwari', obj);
  };
  return (
    <View style={styles.loginScreenContainer}>
      <View style={styles.loginFormView}>
        <Image
          style={styles.logoIcon}
          source={require('../../assets/logo.png')}
        />
        <TextInput
          placeholder="Enter Your Registered Email Address"
          placeholderColor="#c4c3cb"
          style={styles.loginFormTextInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          underlineColorAndroid={isFocused ? '#c25a0f' : '#c4c3cb'}
          onChangeText={(Text) => {
            setEmail(Text);
          }}
        />
        <Button
          buttonStyle={styles.signupButton}
          onPress={handleSubmit}
          title="Send Reset Link"
        />
      </View>
    </View>
  );
};
export default ForgetScreen;
