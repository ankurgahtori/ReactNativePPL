import React, {useEffect, useContext} from 'react';
import 'react-native-gesture-handler';
import {
  NavigationContainer,
  useLinking,
  useTheme,
} from '@react-navigation/native';
import SignOutScreens from './src/Screens/signoutscreens/index';
import AsyncStorage from 'react-native';
import SignInScreens from './src/Screens/signinscreens/index';
import SplashScreen from './src/Screens/splash';
import AuthContext from './src/AuthContext';
import serverURL from './config/config';
const App = () => {
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();
  const ref = React.useRef();
  const {getInitialState} = useLinking(ref, {
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
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isAuthenticating: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isAuthenticating: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log('Restoring token failed', userToken);
      }
      if (userToken)
        Axios.post(serverURL + '/user/verifyUserToken', userToken).then(
          result => {
            if (result.data) {
              dispatch({type: 'RESTORE_TOKEN', token: userToken});
            } else {
              dispatch({type: 'RESTORE_TOKEN', token: null});
            }
          },
        );
    };
    bootstrapAsync();
  }, []);
  const authContext = React.useMemo(() => {
    return {
      signIn: async data => {
        dispatch({type: 'SIGN_IN', token: data});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
    };
  }, []);
  if (!isReady && !state.isAuthenticating) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer initialState={initialState} ref={ref}>
        {state.userToken ? <SignInScreens /> : <SignOutScreens />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};
export default App;
