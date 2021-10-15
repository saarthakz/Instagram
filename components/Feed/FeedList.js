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
  // const [refreshCounter, setRefreshCounter] = useState(1);
  const hourInMilliSeconds = 1000 * 60 * 60;
  const [endTime, setEndTime] = useState(Date.now() - hourInMilliSeconds);
  const [user, setUser] = useContext(userContext);
  const [followingFlag, setFollowingFlag] = useState(false);
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
          const currentFollowingPostsRef = db.collection("allPosts").doc(following.userName).collection("posts").orderBy("createdAt", "desc").endAt(endTime).get();
          currentFollowingPostsRef.forEach((snapshot) => setAllPosts((prevPosts) => [...prevPosts, snapshot.data()]));
        });
      };
    })();
  }, [followingFlag]);


  async function getMorePosts() {
    allFollowings.forEach(async (following) => {
      const currentFollowingPostsRef = db.collection("allPosts").doc(following.userName).collection("posts").orderBy("createdAt", "desc").startAt(endTime).endAt(endTime - hourInMilliSeconds).get();
      currentFollowingPostsRef.forEach((snapshot) => setAllPosts((prevPosts) => [...prevPosts, snapshot.data()]));
    });
    setEndTime(endTime - hourInMilliSeconds);
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

  // return (<>
  //   <StatusBar backgroundColor="black" />
  //   <View>
  //     <Text>Home</Text>

  //   </View>
  // </>);
};
