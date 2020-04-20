import React, {useState, useEffect, useRef, createRef} from 'react';
import {View, Image, Dimensions, Text, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {serverURL} from '../../../config/config';
import AsyncStorage from '@react-native-community/async-storage';
import {TextInput} from 'react-native-paper';
import Axios from 'axios';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SinglePost = ({data}) => {
  let height = Dimensions.get('screen').height;
  const [isReady, setIsReady] = useState(false);
  const [post, setPost] = useState(data.item);
  const [comments, setComments] = useState(post.comments);
  const [commentLimit, setCommentLimit] = useState(1);
  const [commentSkip, setCommentSkip] = useState(0);
  const [ispostLiked, setIsPostLiked] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [commentInput, setCommentInput] = useState();
  const textInputRef = createRef();
  const getUserInfo = async () => {
    try {
      let user = JSON.parse(await AsyncStorage.getItem('userInfo'));
      setUserInfo(user);
      for (let i in post.like) {
        if (post.like[i] === user._id) {
          setIsPostLiked(true);
          break;
        }
      }
      setIsReady(true);
    } catch (err) {
      console.log('error while reading file ', err);
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <>
      {isReady ? (
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={{uri: serverURL + '/profile/' + post.postedBy.image}}
              style={styles.profilePic}
            />
            <Text style={styles.prfileText}>{post.postedBy.username}</Text>
            <View style={{alignSelf: 'flex-end', flex: 1}}>
              <Text style={{alignSelf: 'flex-end'}}>
                {moment(post.date)
                  .startOf('hour')
                  .fromNow()}
              </Text>
            </View>
          </View>
          <View>
            <Image
              source={{uri: serverURL + '/post/' + post.image}}
              style={{height: height / 2, width: '100%'}}
            />
          </View>
          <View style={{backgroundColor: 'white'}}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 10,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{backgroundColor: 'transparent'}}
                onPress={() => {
                  Axios.post(serverURL + '/post/updateLike', {
                    postID: post._id,
                    userID: userInfo._id,
                  }).then(result => {
                    if (result.data) {
                      setIsPostLiked(!ispostLiked);
                      setPost({...post, ...result.data});
                    }
                  });
                }}>
                {ispostLiked ? (
                  <Icon name="heart" color="tomato" size={40} />
                ) : (
                  <Icon name="heart-outline" size={40} />
                )}
              </TouchableOpacity>
              <Text style={styles.likeCount}>{post.like.length}</Text>
              <TouchableOpacity>
                <Image
                  source={require('../../../assets/comments.png')}
                  style={styles.commentIcon}
                />
              </TouchableOpacity>
              <Text style={styles.commentCountText}>
                {post.comments.length}
              </Text>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    marginHorizontal: 5,
                    alignSelf: 'center',
                    fontSize: 30,
                    alignSelf: 'flex-end',
                  }}>
                  {post.category.categoryName.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.postTitleContainer}>
              <Text style={{fontWeight: 'bold', fontSize: 20}}>
                {post.postedBy.username}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                }}>
                {post.title}
              </Text>
            </View>
            <View>
              {comments.length - commentSkip === 0 ? (
                <Text
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    backgroundColor: '#e9e9e9',
                    padding: 5,
                  }}>
                  No more Comment
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setCommentSkip(commentSkip + commentLimit);
                  }}
                  style={{backgroundColor: '#e9e9e9', padding: 5}}>
                  <Text style={{alignSelf: 'center'}}>
                    view all {comments.length - commentSkip} comments
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {comments
              .filter((value, index) => {
                if (index < commentSkip) {
                  return value;
                }
              })
              .map(value => {
                return (
                  <View
                    key={value._id}
                    style={{
                      width: '90%',
                      paddingHorizontal: '5%',
                    }}>
                    <Text
                      style={{
                        marginRight: 2,
                        fontWeight: 'bold',
                        fontSize: 20,
                      }}>
                      {value.commentedBy.username}
                    </Text>
                    <Text style={{fontSize: 20}}>{value.comment}</Text>
                  </View>
                );
              })}
          </View>

          <View style={styles.commentInputContainer}>
            <TextInput
              placeholder="Enter Your Comment"
              placeholderColor="#c4c3cb"
              style={styles.commentInputTextField}
              ref={textInputRef}
              onChangeText={text => {
                setCommentInput(text);
              }}
            />
            <TouchableOpacity
              style={styles.submit}
              disabled={commentInput ? false : true}
              onPress={() => {
                let formdata = new FormData();
                formdata.append('commentedBy', userInfo._id);
                formdata.append('postID', post._id);
                formdata.append('comment', commentInput);
                Axios.post(serverURL + '/post/addComment', formdata).then(
                  result => {
                    if (result.data) {
                      textInputRef.current.clear();
                      setComments([...result.data.comments]);
                      setPost({...post, ...result.data});
                    }
                  },
                );
              }}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: 'justify',
                  width: '100%',
                  color: commentInput
                    ? 'rgba(0, 191, 255, 1)'
                    : 'rgba(0, 0, 0, .1)',
                }}>
                Post
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <></>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, marginBottom: 20},
  header: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 5,
    alignItems: 'center',
  },
  profilePic: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    borderColor: '#f58c20',
    borderWidth: 2,
    margin: 2,
  },
  prfileText: {
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    paddingLeft: 10,
  },
  likeCount: {
    alignSelf: 'center',
    fontSize: 25,
    paddingHorizontal: 5,
  },
  commentIcon: {
    marginLeft: 20,
  },
  commentCountText: {
    alignSelf: 'center',
    fontSize: 25,
    paddingHorizontal: 10,
  },
  postTitleContainer: {
    marginHorizontal: 15,
    marginVertical: 5,
    borderBottomColor: '#e9e9e9',
    borderBottomWidth: 1,
  },
  submit: {
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  commentInputContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignContent: 'flex-end',
    flex: 1,
  },
  commentInputTextField: {
    borderColor: 'black',
    marginVertical: 2,
    height: 50,
    width: '85%',
  },
});
export default SinglePost;
