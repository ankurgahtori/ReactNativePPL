import React, {useEffect, useState, useContext} from 'react';
import {View, Text, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {serverURL} from '../../../config/config';
import {ActivityIndicator} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import GridComponent from './gridComponent';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AuthContext from '../../AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Drawer = createDrawerNavigator();
const ProfileScreen = () => {
  return (
    <Drawer.Navigator drawerPosition="left" drawerStyle={{width: 200}}>
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          headerRight: '',
          headerTitle: 'hh',
          headerRight: () => (
            <Button
              onPress={() => alert('This is a button!')}
              title="Info"
              color="#fff"
            />
          ),
        }}
      />
      <Drawer.Screen name="Logout" component={Logout} />
      <Drawer.Screen name="About" component={About} />
    </Drawer.Navigator>
  );
};
const About = () => {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <Text style={{fontSize: 45, textAlign: 'center'}}>
        This Application is developed by , Ankur Gahtori
      </Text>
    </View>
  );
};
const Logout = () => {
  const {signOut} = useContext(AuthContext);
  return <>{signOut()}</>;
};
const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState();
  const getUserInfo = async () => {
    try {
      let user = JSON.parse(await AsyncStorage.getItem('userInfo'));
      setUserInfo(user);
      getMyCollection({userID: user._id});
    } catch (err) {
      console.log('error while reading file ', err);
    }
  };
  const getMyCollection = user => {
    Axios.post(serverURL + '/post/getPostByUserID', user)
      .then(result => {
        if (result.data) {
          setPosts(result.data);
        }
      })
      .catch(err => {
        console.log('error ', err);
      });
  };
  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <>
      {posts && userInfo ? (
        <ScrollView>
          <View
            style={{
              backgroundColor: 'white',
              alignItems: 'center',
              borderColor: 'color',
              borderWidth: 2,
              margin: 2,
            }}>
            {console.log(serverURL + '/profile/' + userInfo.image)}
            <Image
              style={{
                width: 200,
                height: 200,
                borderRadius: 200 / 2,
                marginVertical: 20,
                borderColor: '#f58c20',
                borderWidth: 2,
                margin: 2,
              }}
              Source={{
                uri: serverURL + '/profile/' + userInfo.image,
              }}
            />
            <Text style={{fontSize: 30}}>{userInfo.username}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            {posts.map(post => {
              return <GridComponent key={post._id} post={post} />;
            })}
          </View>
        </ScrollView>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </>
  );
};
export default ProfileScreen;
