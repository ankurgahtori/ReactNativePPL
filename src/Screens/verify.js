import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import SplashScreen from './splash';
import {serverURL} from '../../config/config';
import Axios from 'axios';
import styles from './style';

const VerifyScreen = ({params, navigation}) => {
  const [isVerifying, setIsVerifying] = useState(true);
  useEffect(() => {
    Axios.post(serverURL + '/user/verify', params, {
      headers: {'content-type': 'application/JSON'},
    }).then(result => {
      if (result.data) {
        setIsVerifying(true);
        navigation.navigate('login');
      }
    });
  }, []);
  return (
    <>
      {isVerifying ? (
        <SplashScreen />
      ) : (
        <>
          <View style={styles.verifyScreen}>
            <Text>Verified Sucessfully Redirecting to Login...</Text>
          </View>
        </>
      )}
    </>
  );
};
export default VerifyScreen;
