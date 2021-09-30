import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import firebase from "firebase/app";
import "firebase/firestore";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function Followers() {

  const route = useRoute();
  const db = firebase.firestore();
  const { currentUser } = route.params;
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    (async () => {
      const followingRef = await db.collection("followers").where("follower", "==", currentUser.userName).get();
      followingRef.forEach((snapshot) => setFollowing((prevFollowing) => [...prevFollowing, snapshot.data()]));
    })();
  }, []);

  return (<>
    <View>
      <Text>Followings of {currentUser.userName}</Text>
    </View>
    <FlatList
      keyExtractor={(item, index) => index.toString()}
      data={followers}
      renderItem={({ item, index }) => {
        return (<>

        </>);
      }}
    />
  </>
  );
};

