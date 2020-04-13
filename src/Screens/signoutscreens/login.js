import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import {Button} from 'react-native-elements';
import {serverURL} from '../../../config/config';
import styles from './style';
import Axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import AuthContext from '../../AuthContext';

const LoginScreen = ({navigation}) => {
  const {signIn} = useContext(AuthContext);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [isFocused, setIsFocused] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loginButtonReady, setLoginButtonReady] = useState(false);
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
    console.log(obj, serverURL);
    Axios.post(serverURL + '/user/loginUser', obj)
      .then(result => {
        if (result) {
          let userToken = result.data;
          Axios.post(serverURL + '/user/verifyUserToken', result.data).then(
            result => {
              if (result.data) {
                if (result.data.isVerified) {
                  signIn(userToken);
                  // navigation.navigate('homepage');
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
            position: 'absolute',
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
    </ScrollView>
  );
};
export default LoginScreen;
