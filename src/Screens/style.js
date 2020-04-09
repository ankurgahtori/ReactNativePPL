import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  logoIcon: {
    alignSelf: 'center',
  },
  containerView: {
    flex: 1,
  },
  loginScreenContainer: {
    flex: 1,
    fontStyle: 'italic',
    color: '#A0A0A0',
  },
  logoText: {
    color: '#f47b13',
    fontSize: 35,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  loginFormView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  loginFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#FFFFFF',
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  loginButton: {
    backgroundColor: '#f58c20',
    borderRadius: 5,
    height: 45,
    marginTop: 10,
    marginLeft: 20,
    width: 200,
  },
  signupButton: {
    backgroundColor: '#f58c20',
    borderRadius: 5,
    height: 45,
    marginTop: 10,
    width: '90%',
    alignSelf: 'center',
  },
  forgetText: {
    height: 30,
    marginTop: 20,
    marginLeft: 20,
    textDecorationLine: 'underline',
  },
  splashScreen: {flex: 1, justifyContent: 'center'},
  verifyScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default styles;
