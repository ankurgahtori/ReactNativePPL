import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer, useLinking} from '@react-navigation/native';
import SignOutScreens from './src/Screens/signoutscreens/index';
import AsyncStorage from '@react-native-community/async-storage';
import SignInScreens from './src/Screens/signinscreens/index';
import AuthContext from './src/AuthContext';
import {serverURL} from './config/config';
import Axios from 'axios';
import SplashScreen from 'react-native-splash-screen';
const App = () => {
  const [isDeepLinkingReady, setIsDeepLinkingReady] = React.useState(false);
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
        setIsDeepLinkingReady(true);
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
            isAuthenticating: false,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            isAuthenticating: false,
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
        if (userToken) {
          let token = {token: JSON.parse(userToken)};
          Axios.post(serverURL + '/user/verifyUserToken', token)
            .then(result => {
              if (result.data) {
                dispatch({type: 'SIGN_IN', token: userToken});
                AsyncStorage.setItem('userInfo', JSON.stringify(result.data));
              } else {
                dispatch({type: 'RESTORE_TOKEN', token: null});
              }
            })
            .catch(err => {
              console.log('Erro', err);
            });
        } else {
          dispatch({type: 'RESTORE_TOKEN', token: null});
        }
      } catch (e) {
        console.log('Restoring token failed', e);
      }
    };
    bootstrapAsync();
  }, []);
  const authContext = React.useMemo(() => {
    return {
      signIn: async data => {
        dispatch({type: 'SIGN_IN', token: data.token});
      },
      signOut: async () => {
        dispatch({type: 'SIGN_OUT'});
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('userInfo');
      },
    };
  }, []);
  if (!state.isAuthenticating || isDeepLinkingReady) {
    SplashScreen.hide();
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
