import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Button} from 'react-native-elements';
import {serverURL} from '../../../config/config';
import styles from './style';
import Axios from 'axios';
import {ScrollView, TouchableHighlight} from 'react-native-gesture-handler';
import AuthContext from '../../AuthContext';
import LinearGradient from 'react-native-linear-gradient';

const LoginScreen = ({navigation}) => {
  const {signIn} = useContext(AuthContext);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [isFocused, setIsFocused] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loginButtonReady, setLoginButtonReady] = useState(false);
  const [Color_bg, setColor] = useState(false);
  useEffect(() => {
    if (email && password) {
      setLoginButtonReady(true);
    } else {
      setLoginButtonReady(false);
    }
  }, [email, password]);
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
    Axios.post(serverURL + '/user/loginUser', obj)
      .then(result => {
        if (result) {
          let userToken = result.data;
          Axios.post(serverURL + '/user/verifyUserToken', result.data).then(
            result => {
              if (result.data) {
                if (result.data.isVerified) {
                  AsyncStorage.setItem(
                    'userInfo',
                    JSON.stringify(result.data),
                    err => {
                      console.log(err);
                    },
                  );
                  AsyncStorage.setItem(
                    'userToken',
                    JSON.stringify(userToken.token),
                    err => {
                      console.log(err);
                    },
                  );
                  signIn(userToken);
                } else {
                  alert('Your account is not verified');
                }
              } else {
                setModalVisible(true);
              }
            },
          );
        }
      })
      .catch(err => {
        console.log('here error comming', err);
      });
  };
  return (
    <ScrollView style={{...styles.loginScreenContainer}}>
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            backgroundColor: 'rgba(100,100,100, 0.5)',
            padding: 20,
          }}>
          <View
            style={{
              alignSelf: 'center',
              width: (windowWidth * 2) / 3,
              height: windowHeight / 3,
              backgroundColor: 'white',
              justifyContent: 'space-between',
            }}>
            <View underlineColorAndroid="black">
              <Text
                style={{alignSelf: 'center', fontWeight: 'bold', fontSize: 20}}>
                Forgotten password for ?
              </Text>
              <Text style={{textAlign: 'center'}}>{email}</Text>
              <Text style={{textAlign: 'center'}}>
                We can send you an email to help you get backinto your account
              </Text>
            </View>
            <Text style={{textAlign: 'center'}} />
            <TouchableOpacity
              style={{
                backgroundColor: '#e9e9e9',
                padding: 5,
              }}
              onPress={() => {
                setModalVisible(!modalVisible);
                navigation.navigate('forget');
              }}>
              <Text style={{textAlign: 'center', color: '#1076ea'}}>
                Send Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: '#e9e9e9',
                marginBottom: 20,
                padding: 5,
              }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text
                style={{
                  textAlign: 'center',
                }}>
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.loginFormView}>
        <Image
          style={styles.logoIcon}
          source={require('../../../assets/logo.png')}
        />
        <TextInput
          placeholder="Email"
          placeholderColor="#c4c3cb"
          style={styles.loginFormTextInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          underlineColorAndroid={isFocused ? '#c25a0f' : '#c4c3cb'}
          onChangeText={Text => {
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
          onChangeText={Text => {
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
            disabled={!loginButtonReady}
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
        <TouchableWithoutFeedback
          onPressIn={() => setColor(true)}
          onPressOut={() => setColor(false)}
          onPress={() => {
            navigation.navigate('signup')}}>
          <View>
            {/* <View style={{backgroundColor: Color_bg ? 'green' : 'red'}}>
          <Text
            style={{
              color: '#1076ea',
              fontSize: 20,
              width: '90%',
              alignSelf: 'center',
            }}>
            Create My Account Now !
          </Text></View> */}
            <LinearGradient
              colors={
                Color_bg
                  ? ['#4c669f', '#3b5998', '#192f6a']
                  : ['#4c109f', '#2b5908', '#111f6a']
              }
              style={{
                flex: 1,
                paddingLeft: 15,
                paddingRight: 15,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Gill Sans',
                  textAlign: 'center',
                  margin: 10,
                  color: '#ffffff',
                  backgroundColor: 'transparent',
                }}>
                Sign in with Facebook
              </Text>
            </LinearGradient>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Gill Sans',
                textAlign: 'center',
                margin: 10,
                color: '#ffffff',
                backgroundColor: 'red',
              }}>
              Sign in with Facebook FacebookFacebook
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </ScrollView>
  );
};
export default LoginScreen;
