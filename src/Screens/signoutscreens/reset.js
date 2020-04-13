import React, {useState, useEffect} from 'react';
import {Text, View, TextInput, Image, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-elements';
import styles from './style';
import Axios from 'axios';
import {serverURL} from '../../../config/config';

const ResetScreen = ({route, navigation}) => {
  const [waringText, setWarningText] = useState();
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };
  const handleSubmit = () => {
    let obj = {
      password: password,
      userID: route.params.userID,
    };
    Axios.post(serverURL + '/user/updatePassword', obj, {
      headers: {'content-type': 'application/JSON'},
    }).then(result => {
      if (result.data) {
        console.log(result.data);
        navigation.navigate('login');
      }
    });
  };
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isReady, setIsReady] = useState(true);
  useEffect(() => {
    setIsReady(true);
    if (password) {
      if (confirmPassword !== password) {
        setWarningText('Password MisMatch');
      } else {
        setWarningText();
      }
    } else {
      setWarningText();
    }
    if (password && confirmPassword === password) {
      setIsReady(false);
    }
  }, [confirmPassword, password]);
  return (
    <View style={styles.loginScreenContainer}>
      <View style={styles.loginFormView}>
        <Image
          style={styles.logoIcon}
          source={require('../../../assets/logo.png')}
        />

        <TextInput
          placeholder="Password"
          placeholderColor="#c4c3cb"
          style={styles.loginFormTextInput}
          secureTextEntry={true}
          onFocus={handleFocus}
          onBlur={handleBlur}
          underlineColorAndroid={isFocused ? '#c25a0f' : '#c4c3cb'}
          onChangeText={Text => {
            setPassword(Text);
          }}
        />
        <TextInput
          placeholder="Confirm Password"
          placeholderColor="#c4c3cb"
          style={styles.loginFormTextInput}
          secureTextEntry={true}
          onFocus={handleFocus}
          onBlur={handleBlur}
          underlineColorAndroid={isFocused ? '#c25a0f' : '#c4c3cb'}
          onChangeText={Text => {
            setConfirmPassword(Text);
          }}
        />
        <Text style={styles.inputWarning}>{waringText}</Text>

        <Button
          buttonStyle={styles.signupButton}
          onPress={handleSubmit}
          title="Reset"
          disabled={isReady}
        />
      </View>
    </View>
  );
};

export default ResetScreen;
