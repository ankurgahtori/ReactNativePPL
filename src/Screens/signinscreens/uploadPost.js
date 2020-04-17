import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  AsyncStorage,
  PermissionsAndroid,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {serverURL} from '../../../config/config';
import {ActivityIndicator} from 'react-native-paper';

const UploadScreen = () => {
  const [userInfo, setUserInfo] = useState();
  AsyncStorage.getItem('userInfo', (err, userInfo) => {
    setUserInfo(JSON.parse(userInfo));
  });

  const title = 'some random title';
  const [isUploading, setIsLoading] = useState(true);
  const [avatarSource, setAvatarSource] = useState(null);
  const [image, setImage] = useState();
  const postPicker = () => {
    const options = {
      // noData: true,
      // title: 'Select Avatar',
      // customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
      // storageOptions: {
      // skipBackup: true,
      //   path: 'images',
      // },
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
      filename: photo.fileName,
      type: photo.type,
      uri: photo.uri,
    };
    data.append('image', imageData);
    data.append('postedBy', userInfo._id);
    return data;
  };
  // const checkPermission = async () => {
  //   const granted = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //     {
  //       title: 'AndoridPermissionExample App Camera Permission',
  //       message: 'AndoridPermissionExample App needs access to your camera ',
  //     },
  //   );
  //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //     alert('permission granted');
  //   } else {
  //     alert('CAMERA Permission Denied.');
  //   }
  // };
  const handleUploadPhoto = () => {
    let data = createFormData(image);
    console.log('sending datan : ', data);
    axios
      .post(serverURL + '/post/create', data)
      .then(result => {
        if (result.data) {
          console.log(result.data);
          alert('upload sucessfull');
        }
      })
      .catch(err => {
        console.warn(err);
      });
  };
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
