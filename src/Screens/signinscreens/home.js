import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from 'react-native';
import SinglePost from './singlePostComponent';
import Axios from 'axios';
import {serverURL} from '../../../config/config';
import SplashScreen from '../splash';

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefresing, setIsRefresing] = useState(false);
  const [limit, setLimit] = useState(2);
  const [skip, setSkip] = useState(0);
  const [postLeft, setPostsLeft] = useState(true);
  const getPosts = () => {
    Axios.get(serverURL + '/post/getPost', {
      params: {
        skip: skip,
        limit: limit,
        sort: 'date',
        order: -1,
        category: 'Fake_ID',
      },
    })
      .then(result => {
        if (result.data.length) {
          setPosts([...posts, ...result.data]);
          setSkip(limit + skip);
          setIsLoading(false);
        } else {
          setPostsLeft(false);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };
  getNewPost = () => {
    console.log('call reached ', {date: posts[0].date});
    Axios.post(serverURL + '/post/getNewPosts', {date: posts[0].date})
      .then(result => {
        if (result.data) {
          console.log(result.data);
          setPosts([...result.data, ...posts]);
          setSkip(skip + result.data.length);
        }
        setIsRefresing(false);
      })
      .catch(err => {
        console.log(err);
        setIsRefresing(false);
      });
  };
  useEffect(() => {
    getPosts();
  }, []);
  if (!posts) {
    return <SplashScreen />;
  }
  return (
    <View style={{backgroundColor: 'white'}}>
      <FlatList
        onEndReached={() => {
          if (postLeft) {
            setIsLoading(!isLoading);
            getPosts();
          }
        }}
        initialNumToRender={2}
        maxToRenderPerBatch={1}
        onEndReachedThreshold={1}
        data={posts}
        keyExtractor={post => post._id}
        ListFooterComponent={() =>
          postLeft ? (
            !isLoading ? null : (
              <>
                <ActivityIndicator size="large" />
                <Text style={styles.postStatusText}>Loading Posts...</Text>
              </>
            )
          ) : (
            <Text style={styles.postStatusText}>No more Posts...</Text>
          )
        }
        renderItem={post => {
          return <SinglePost data={post} key={post._id} />;
        }}
        onRefresh={() => {
          setIsRefresing(true);
          getNewPost();
        }}
        refreshing={isRefresing}
      />
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  postStatusText: {textAlign: 'center'},
});
