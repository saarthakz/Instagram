import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button, Modal, FlatList, Image, useWindowDimensions, Pressable } from 'react-native';
import firebase from "firebase/app";
import "firebase/firestore";
import { useRoute, useNavigation } from "@react-navigation/native";
import { userContext } from "../../contexts/userContext";

export default function FoundUser() {
  const db = firebase.firestore();
  const route = useRoute();
  const StackNavigation = useNavigation();
  const { userName } = route.params;
  const [foundUser, setFoundUser] = useState({});
  const [user, setUser] = useContext(userContext);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState("");

  useEffect(() => {
    (async () => {
      const userDoc = await db.collection("users").where("userName", "==", userName).get();
      userDoc.forEach((snapshot) => setFoundUser(snapshot.data()));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (foundUser.name) {
        setPosts([]);
        const postsDoc = await db.collection("users").doc(foundUser.userID).collection("posts").get();
        postsDoc.forEach((snapshot) => setPosts((previousPosts) => [...previousPosts, snapshot.data()]));
        const followingRef = await db.collection("followers").where("follower", "==", user.userName).where("followee", "==", foundUser.userName).get();
        followingRef.forEach((snapshot) => setFollowing(snapshot.data().followID));
      };
    })();
  }, [foundUser]);

  async function toggleFollow() {
    const followCollectionRef = await db.collection("followers");
    const foundUserRef = db.collection("users").doc(foundUser.userID);
    const userRef = db.collection("users").doc(user.userID);

    if (!following) {
      const dateObj = new Date();
      const date = {
        date: dateObj.getUTCDate(),
        month: dateObj.getUTCMonth(),
        year: dateObj.getUTCFullYear(),
        hour: dateObj.getUTCHours(),
        minute: dateObj.getUTCMinutes()
      };
      const followDoc = await followCollectionRef.add({
        follower: user.userName,
        followee: foundUser.userName,
        date
      });
      const followID = followDoc.id;
      await followDoc.update({ followID });
      await foundUserRef.update({
        followers: foundUser.followers + 1
      });
      setFoundUser((oldFoundUser) => ({ ...oldFoundUser, followers: oldFoundUser.followers + 1 }));
      await userRef.update({
        following: user.following + 1
      });
      setUser((oldUser) => ({ ...oldUser, following: oldUser.following + 1 }));
      setFollowing(followID);
    };

    if (following) {
      await followCollectionRef.doc(following).delete();
      await foundUserRef.update({
        followers: foundUser.followers - 1
      });
      setFoundUser((oldFoundUser) => ({ ...oldFoundUser, followers: oldFoundUser.followers - 1 }));
      await userRef.update({
        following: user.following - 1
      });
      setUser((oldUser) => ({ ...oldUser, following: oldUser.following - 1 }));
      setFollowing("");
    }
  };

  return (<>
    <Text>{foundUser.name}</Text>
    <Text>{foundUser.email}</Text>
    <Text>{foundUser.userName}</Text>
    <Button
      title={following ? "Following" : "Follow"}
      onPress={() => toggleFollow()}
      color={following ? "hsl(150, 60%, 40%)" : "hsl(0, 0%, 60%)"}
    />
    <Button
      title="Following"
    />
    <Button
      title="Followers"
    />
    <FlatList
      data={posts}
      extraData={posts}
      keyExtractor={(item, index) => index.toString()}
      numColumns={3}
      renderItem={({ item, index }) => {
        return (<>
          <View key={index}>
            <Pressable onPressIn={() => StackNavigation.navigate("FoundUserPost", {
              post: item,
              owner: foundUser
            })}>
              <Text>{item.caption}</Text>
              <Image
                source={{
                  uri: item.postImageURL,
                  width: 100,
                  height: 100,
                }}
              />
            </Pressable>
          </View>
        </>);
      }}
    />
  </>);
};
