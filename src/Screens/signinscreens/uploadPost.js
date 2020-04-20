import React, {useState, useEffect} from 'react';
import {View, Text, Image, Picker} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {serverURL} from '../../../config/config';
import {ActivityIndicator} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
const UploadScreen = props => {
  const [userInfo, setUserInfo] = useState();
  console.log(props);
  const title = 'some random title';
  const [isUploading, setIsLoading] = useState(true);
  const [avatarSource, setAvatarSource] = useState(null);
  const [image, setImage] = useState();
  const postPicker = () => {
    const options = {
      noData: true,
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};
        setAvatarSource(source);
        setImage(response);
        console.log(response);
      }
    });
  };
  const createFormData = (photo = image) => {
    let data = new FormData();
    let imageData = {
      name: photo.fileName,
      type: photo.type,
      uri: photo.uri,
    };
    data.append('image', imageData);
    data.append('postedBy', userInfo._id);
    return data;
  };
  const handleUploadPhoto = () => {
    let data = createFormData(image);
    axios
      .post(serverURL + '/post/create', data)
      .then(result => {
        if (result.data) {
          alert('upload sucessfull');
        }
      })
      .catch(err => {
        console.warn(err, 'error');
      });
  };
  useEffect(() => {
    AsyncStorage.getItem('userInfo', (err, userInfo) => {
      setUserInfo(JSON.parse(userInfo));
    });
  }, []);
  if (!userInfo) {
    return <ActivityIndicator size="large" />;
  }
  return (
    <View style={{flex: 1, justifyContent: 'flex-end'}}>
      <Image source={avatarSource} style={{flex: 1}} />
      {!avatarSource ? (
        <TouchableOpacity
          onPress={() => {
            postPicker();
          }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: 'grey',
              padding: 40,
            }}>
            <Text> Select Posts</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'center',
            backgroundColor: 'grey',
            padding: 40,
          }}>
          <TouchableOpacity
            onPress={() => {
              setAvatarSource(null);
            }}>
            <Text>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleUploadPhoto();
              return <ActivityIndicator />;
            }}>
            <Text>Upload</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
export default UploadScreen;
