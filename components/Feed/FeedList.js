import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, FlatList, Button, StyleSheet, StatusBar } from 'react-native';
import firebase from "firebase/app";
import "firebase/firestore";
import { userContext } from "../../contexts/userContext";
import { useFocusEffect } from "@react-navigation/native";
import Post from "../Profile/Post";

export default function FeedList() {

  const db = firebase.firestore();
  const [allFollowings, setAllFollowings] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [postCountLimit, setPostCountLimit] = useState(10);
  const [user, setUser] = useContext(userContext);
  const [followingFlag, setFollowingFlag] = useState(false);
  const [postsFlag, setPostsFlag] = useState(false);
  const flatListRef = useRef(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignContent: "center",
    },
  });

  useFocusEffect(() => {
    (async () => {
      const allFollowingsRef = await db.collection("followers").where("follower", "==", user.userName).get();
      setAllFollowings([]);
      allFollowingsRef.forEach((snapshot) => setAllFollowings((prevFollowings) => [...prevFollowings, snapshot.data()]));
      setFollowingFlag(true);
    })();
  }, []);

  useFocusEffect(() => {
    (async () => {
      setAllPosts([]);
      if (followingFlag) {
        allFollowings.forEach(async (following) => {
          const currentFollowingPostsRef = await db.collection("posts").where("postBy", "==", following).orderBy("createdAt").limit(postCountLimit).get();
          currentFollowingPostsRef.forEach((snapshot) => setAllPosts((prevPosts) => [...prevPosts, snapshot.data()]));
          setPostsFlag(true);
          setFollowingFlag(false);
        });
      };
    })();
  }, [followingFlag]);

  useFocusEffect(() => {
    if (postsFlag) {
      allPosts.sort((firstPost, secondPost) => secondPost.createdAt - firstPost.createdAt);
      setPostsFlag(false);
    };
  }, [postsFlag]);

  async function getMorePosts() {
    setPostCountLimit(20);
    setFollowingFlag(true);
  };

  return (<>
    <StatusBar backgroundColor="black" />
    <View>
      <Text>Home</Text>
      <FlatList
        ref={flatListRef}
        keyExtractor={(item, index) => index.toString()}
        data={allPosts}
        extraData={allPosts}
        onEndReached={() => getMorePosts()}
        renderItem={({ item, index }) => {
          return (<>
            {/* <Post /> */}
          </>);
        }}
      />
    </View>
  </>);

  return (<>
    <StatusBar backgroundColor="black" />
    <View>
      <Text>Home</Text>

    </View>
  </>);
};
