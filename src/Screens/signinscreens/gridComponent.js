import React from 'react';
import {View, Text, Image, Dimensions} from 'react-native';
import {serverURL} from '../../../config/config';
const GridComponent = ({post}) => {
  console.log(post, '00000');
  return (
    <>
      <View
        style={{
          backgroundColor: 'white',
          alignItems: 'center',
          paddingVertical: 0.02 * Dimensions.get('window').height,
        }}>
        <Image
          source={{uri: serverURL + '/post/' + post.image}}
          style={{
            height: 0.3 * Dimensions.get('window').height,
            width: 0.48 * Dimensions.get('window').width,
            borderColor: 'white',
            borderWidth: 2,
          }}
        />
      </View>
    </>
  );
};
export default GridComponent;
