import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer, useLinking} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Platform, Text, Linking} from 'react-native';
import LoginScreen from './src/Screens/login';
import SignupScreen from './src/Screens/signup';
import ForgetScreen from './src/Screens/forget';
import VerifyScreen from './src/Screens/verify';
const Stack = createStackNavigator();
const App = () => {
  const ref = React.useRef();

  const demo = useLinking(ref, {
    prefixes: ['ppl://user'],
    config: {
      verify: {
        path: 'verify/:email',
      },
      reset: {
        path: 'reset/:userID',
      },
    },
  });
  const {getInitialState} = demo;
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();
  useEffect(() => {
    if (initialState) {
      console.log(initialState, '11111111');
    }
  }, [initialState]);
  React.useEffect(() => {
    getInitialState()
      .catch(e => {
        console.error(e);
      })
      .then(state => {
        if (state !== undefined) {
          setInitialState(state);
        }
        setIsReady(true);
      });
  }, [getInitialState]);

  if (!isReady) {
    return null;
  }
  // const handleUrl = url => {
  //   if (url) {
  //     let id = url.split('verify/');
  //     console.log(id);
  //   }
  // };
  // useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     Linking.getInitialURL()
  //       .then(url => {
  //         handleUrl(url);
  //       })
  //       .catch(err => {
  //         console.log(err, 'error');
  //       });
  //     Linking.addEventListener('url', ({url}) => {
  //       handleUrl(url);
  //     }); //add on mount
  //   }
  //   return () => {
  //     Linking.removeEventListener('url'); //remove on unmount
  //   };
  // }, []);

  return (
    <NavigationContainer initialState={initialState} ref={ref}>
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
        <Stack.Screen
          name="verify"
          component={VerifyScreen}
          options={{title: 'Verifying Your Accout ...'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
