import React, {useState} from 'react';
import {Text, View, TextInput, Image, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-elements';
import {serverURL} from '../../config/config';
import styles from './style';
import Axios from 'axios';
const LoginScreen = ({navigation}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };
  const handleSubmit = () => {
    let obj = {
      password: password,
      email: email,
    };
    console.log(obj, serverURL);
    Axios.post(serverURL + '/user/loginUser', obj)
      .then((result) => {
        if (result) {
          Axios.post(serverURL + '/user/verifyUserToken', result.data).then(
            (result) => {
              if (result.data.verify) {
                alert('user Found');
                let email = result.data.email;
                let password = result.data.password;
                console.log(email, '*#*#*#*#*', password);
              }
            },
          );
        }
      })
      .catch((err) => {
        console.log('here error comming', err);
      });
  };
  return (
    <View style={styles.loginScreenContainer}>
      <View style={styles.loginFormView}>
        <Image
          style={styles.logoIcon}
          source={require('../../assets/logo.png')}
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
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Button
            buttonStyle={styles.loginButton}
            onPress={handleSubmit}
            title="Login"
          />
          <Text
            style={styles.forgetText}
            onPress={() => navigation.navigate('forget')}>
            forget password
          </Text>
        </View>
        <Text
          style={{
            marginTop: 10,
            width: '90%',
            alignSelf: 'center',
          }}>
          {' '}
          I do not have any account yet.tiwai
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#DDDDDD',
          }}
          onPress={() => navigation.navigate('signup')}>
          <Text
            style={{
              color: '#1076ea',
              fontSize: 20,
              width: '90%',
              alignSelf: 'center',
            }}>
            Create My Account Now !
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default LoginScreen;
