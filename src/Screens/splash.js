import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import styles from './style';

const SplashScreen = () => {
  return (
    <View style={styles.splashScreen}>
      <ActivityIndicator size="large" color="#f58c20" />
    </View>
  );
};
export default SplashScreen;
