import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, FlatList, Button, StyleSheet, StatusBar } from 'react-native';
import firebase from "firebase/app";
import "firebase/firestore";
import { userContext } from "../../contexts/userContext";
import Post from "../Profile/Post";

export default function FeedList() {

  const db = firebase.firestore();
  const dateObj = new Date();
  const [postDate, setPostDate] = useState({
    date: dateObj.getUTCDate(),
    month: dateObj.getUTCMonth(),
    year: dateObj.getUTCFullYear()
  });
  const [allFollowings, setAllFollowings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [user, setUser] = useContext(userContext);
  const [flag, setFlag] = useState(false);
  const flatListRef = useRef(null);

  function getLastDate(date, month, year) {
    if (date != 1) return { date: date - 1, month, year };

    const lastMonth = month - 1;

    if (lastMonth) {
      if ((lastMonth == 2) && (year % 4 == 0)) return { date: 29, month: 2, year };
      if ((lastMonth == 2) && (year % 4 != 0)) return { date: 28, month: 2, year };

      const MonthsOf30 = [4, 6, 9, 11];
      if (MonthsOf30.includes(lastMonth)) return { date: 30, month: lastMonth, year };
      else return { date: 31, month: lastMonth, year };

    } else return { date: 31, month: 12, year: year - 1 };
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignContent: "center",
    },
  });

  useEffect(() => {
    (async () => {
      setPostDate((currentDate) => getLastDate(currentDate.date, currentDate.month, currentDate.year));
      const allFollowingsRef = await db.collection("followers").where("follower", "==", user.userName).get();
      setAllFollowings([]);
      allFollowingsRef.forEach((snapshot) => setAllFollowings((prevFollowings) => [...prevFollowings, snapshot.data()]));
      setFlag(true);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setAllPosts([]);
      if (flag) {
        allFollowings.forEach(async (following) => {
          const currentFollowingPostsRef = await db.collection("posts").where("postBy", "==", following).where("date", "==", postDate.date).where("month", "==", postDate.month).where("year", "==", postDate.year).get();
          currentFollowingPostsRef.forEach((snapshot) => setAllPosts((prevPosts) => [...prevPosts, snapshot.data()]));
        });
      };
    })();
  }, [flag]);

  async function getMorePosts() {
    const scrollToIndex = allPosts.length - 1;
    setPostDate((currentDate) => getLastDate(currentDate.date, currentDate.month, currentDate.year));
    allFollowings.forEach(async (following) => {
      const currentFollowingPostsRef = await db.collection("posts").where("postBy", "==", following).where("date", "==", postDate.date).where("month", "==", postDate.month).where("year", "==", postDate.year).get();
      currentFollowingPostsRef.forEach((snapshot) => setAllPosts((prevPosts) => [...prevPosts, snapshot.data()]));
    });
    flatListRef.current.scrollToIndex({ index: scrollToIndex });
  };

  async function refreshPosts() {
    setRefreshing(true);
    setPostDate({
      date: dateObj.getUTCDate(),
      month: dateObj.getUTCMonth(),
      year: dateObj.getUTCFullYear()
    });
    const allFollowingsRef = await db.collection("followers").where("follower", "==", user.userName).get();
    setAllFollowings([]);
    allFollowingsRef.forEach((snapshot) => setAllFollowings((prevFollowings) => [...prevFollowings, snapshot.data()]));
    setAllPosts([]);
    allFollowings.forEach(async (following) => {
      const currentFollowingPostsRef = await db.collection("posts").where("postBy", "==", following).where("date", "==", postDate.date).where("month", "==", postDate.month).where("year", "==", postDate.year).get();
      currentFollowingPostsRef.forEach((snapshot) => setAllPosts((prevPosts) => [...prevPosts, snapshot.data()]));
    });
    setRefreshing(false);
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
        refreshing={refreshing}
        onRefresh={() => refreshPosts()}
        onEndReached={() => getMorePosts()}
        renderItem={({ item, index }) => {
          return (<>
            {/* <Post /> */}
          </>);
        }}
      />
    </View>
  </>);
};
