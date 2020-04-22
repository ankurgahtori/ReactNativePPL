import React, {useState, useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {serverURL} from '../../../config/config';
import {ActivityIndicator, TextInput} from 'react-native-paper';
import {Picker} from '@react-native-community/picker';
import AsyncStorage from '@react-native-community/async-storage';
import DocumentPicker from 'react-native-document-picker';
import Axios from 'axios';

const UploadScreen = () => {
  const [userInfo, setUserInfo] = useState();
  const [categorySelected, setCategorySelected] = useState();
  const [contactNumber, setContactNumber] = useState();
  const [title, setTitle] = useState();
  const [isUploadingReady, setIsUploadingReady] = useState(false);
  const [avatarSource, setAvatarSource] = useState(null);
  const [image, setImage] = useState();
  const [categories, setCategories] = useState();
  const [video, setVideo] = useState();

  const pickVideo = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
      console.log(res);
      setVideo(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('user canceled video selection');
      } else {
        throw err;
      }
    }
  };
  useEffect(() => {
    if (title && categorySelected && contactNumber) {
      setIsUploadingReady(true);
    } else {
      setIsUploadingReady(false);
    }
  }, [title, categorySelected, contactNumber]);
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
      }
    });
  };
  const createFormData = (file = image) => {
    let formData = new FormData();
    let data = {
      name: file.fileName || file.name,
      type: file.type,
      uri: file.uri,
    };
    formData.append('image', data);
    formData.append('postedBy', userInfo._id);
    formData.append('category', categorySelected);
    formData.append('contactNumber', contactNumber);
    formData.append('title', title);
    return formData;
  };
  const handleVideoUpload = () => {
    let data = createFormData(video);
    Axios.post(serverURL + '/post/create', data)
      .then(result => {
        if (result.data) {
          alert('upload sucessfull');
          setAvatarSource(null);
        }
      })
      .catch(err => {
        console.warn(err, 'error');
      });
  };
  const handleUploadPhoto = () => {
    let data = createFormData(image);
    axios
      .post(serverURL + '/post/create', data)
      .then(result => {
        if (result.data) {
          alert('upload sucessfull');
          setAvatarSource(null);
        }
      })
      .catch(err => {
        console.warn(err, 'error');
      });
  };
  const getCategories = () => {
    axios.get(serverURL + '/category/getCategories').then(result => {
      if (result.data) {
        setCategories(result.data);
      }
    });
  };
  useEffect(() => {
    getCategories();
    AsyncStorage.getItem('userInfo', (err, userInfo) => {
      setUserInfo(JSON.parse(userInfo));
    });
  }, []);
  if (!userInfo) {
    return <ActivityIndicator size="large" />;
  }
  return (
    <View style={{flex: 1, justifyContent: 'flex-end'}}>
      <Image
        source={avatarSource}
        style={{resizeMode: 'center', height: '35%'}}
      />
      {avatarSource || video ? (
        <>
          <Text style={{fontSize: 20}}>Enter Title</Text>
          <TextInput
            placeholder="Write Something about pet"
            onChangeText={Text => {
              setTitle(Text);
            }}
          />
          <Text style={{fontSize: 20}}>Contact</Text>
          <TextInput
            placeholder="Enter Your Contact Number"
            onChangeText={text => {
              setContactNumber(text);
            }}
          />
          <Text style={{fontSize: 20}}>Select Category</Text>
          <Picker
            selectedValue={categorySelected}
            style={{height: 50, width: '100%'}}
            onValueChange={(itemValue, itemIndex) => {
              setCategorySelected(itemValue);
            }}>
            {categories.map(value => (
              <Picker.Item label={value.categoryName} value={value._id} />
            ))}
          </Picker>
        </>
      ) : null}
      {!avatarSource && !video ? (
        <>
          <TouchableOpacity
            style={{
              padding: 20,
              marginBottom: 10,
              backgroundColor: 'rgba(0, 191, 255, 1)',
            }}
            onPress={() => {
              pickVideo();
            }}>
            <Text style={{textAlign: 'center'}}> Select Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 20,
              backgroundColor: 'rgba(0, 191, 255, 1)',
            }}
            onPress={() => {
              postPicker();
            }}>
            <Text style={{textAlign: 'center'}}> Select Posts</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View
          style={{
            backgroundColor: 'white',
            marginVertical: 4,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignContent: 'center',
          }}>
          <TouchableOpacity
            style={{backgroundColor: 'rgba(0, 191, 255, 1)', padding: 20}}
            onPress={() => {
              setAvatarSource(null);
              setVideo(null);
            }}>
            <Text>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!isUploadingReady}
            style={{
              padding: 20,
              backgroundColor: isUploadingReady
                ? 'rgba(0, 191, 255, 1)'
                : 'rgba(0, 0, 0, .1)',
            }}
            onPress={() => {
              video ? handleVideoUpload() : handleUploadPhoto();
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
