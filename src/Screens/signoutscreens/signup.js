import React, {useState} from 'react';
import {Text, View, TextInput, Image, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-elements';
import styles from './style';
import Axios from 'axios';
import {serverURL} from '../../../config/config';
import { ScrollView } from 'react-native-gesture-handler';

const SignupScreen = ({navigation}) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };
  const handleSubmit = () => {
    let obj = {
      username: username,
      lastName: lastName,
      firstName: firstName,
      email: email,
      password: password,
    };
    console.log(obj);
    Axios.post(serverURL + '/user/insertUser', obj, {
      headers: {'content-type': 'application/JSON'},
    }).then((result) => {
      alert('sign up complete');
    });
  };
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <ScrollView style={styles.loginScreenContainer}>
      <View style={styles.loginFormView}>
        <Image
          style={styles.logoIcon}
          source={require('../../../assets/logo.png')}
        />
        <TextInput
          placeholder="Username"
          placeholderColor="#c4c3cb"
          style={styles.loginFormTextInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          underlineColorAndroid={isFocused ? '#c25a0f' : '#c4c3cb'}
          onChangeText={(Text) => {
            setUsername(Text);
          }}
        />
        <TextInput
          placeholder="Password"
          placeholderColor="#c4c3cb"
          style={styles.loginFormTextInput}
          secureTextEntry={true}
          onFocus={handleFocus}
          onBlur={handleBlur}
          underlineColorAndroid={isFocused ? '#c25a0f' : '#c4c3cb'}
          onChangeText={(Text) => {
            setPassword(Text);
          }}
        />
        <TextInput
          placeholder="Email"
          placeholderColor="#c4c3cb"
          style={styles.loginFormTextInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          underlineColorAndroid={isFocused ? '#c25a0f' : '#c4c3cb'}
          onChangeText={(Text) => {
            setEmail(Text);
          }}
        />
        <TextInput
          placeholder="First Name"
          placeholderColor="#c4c3cb"
          style={styles.loginFormTextInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          underlineColorAndroid={isFocused ? '#c25a0f' : '#c4c3cb'}
          onChangeText={(Text) => {
            setFirstName(Text);
          }}
        />
        <TextInput
          placeholder="Last Name"
          placeholderColor="#c4c3cb"
          style={styles.loginFormTextInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          underlineColorAndroid={isFocused ? '#c25a0f' : '#c4c3cb'}
          onChangeText={(Text) => {
            setLastName(Text);
          }}
        />
        <Button
          buttonStyle={styles.signupButton}
          onPress={handleSubmit}
          title="Signup"
        />
        <Text
          style={{
            marginTop: 10,
            width: '90%',
            alignSelf: 'center',
          }}>
          I already have an account.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#DDDDDD',
          }}
          onPress={() => navigation.navigate('login')}>
          <Text
            style={{
              color: '#1076ea',
              fontSize: 20,
              width: '90%',
              alignSelf: 'center',
            }}>
            Login My Account !
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;
