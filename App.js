import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Platform, Text, Linking} from 'react-native';
import LoginScreen from './src/Screens/login';
import SignupScreen from './src/Screens/signup';
import ForgetScreen from './src/Screens/forget';
const Stack = createStackNavigator();
const App = () => {
  const handleUrl = url => {
    if (url) {
      let id = url.split('verify/');
    }
  };
  useEffect(() => {
    if (Platform.OS === 'android') {
      Linking.getInitialURL()
        .then(url => {
          handleUrl(url);
        })
        .catch(err => {
          console.log(err, 'error');
        });
      Linking.addEventListener('url', ({url}) => {
        handleUrl(url);
      }); //add on mount
    }
    return () => {
      Linking.removeEventListener('url'); //remove on unmount
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f58c20',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
          headerLeft: null,
        }}>
        <Stack.Screen
          name="login"
          component={LoginScreen}
          options={{title: 'Login Page'}}
        />
        <Stack.Screen
          name="signup"
          component={SignupScreen}
          options={{title: 'Signup Page'}}
        />
        <Stack.Screen
          name="forget"
          component={ForgetScreen}
          options={{title: 'Forget Page'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
