import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './login';
import SignupScreen from './signup';
import ForgetScreen from './forget';
import VerifyScreen from './verify';
const Stack = createStackNavigator();

const SignOutScreens = props => {
  console.log(props,";;;;;;");
  return (
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
  );
};
export default SignOutScreens;
