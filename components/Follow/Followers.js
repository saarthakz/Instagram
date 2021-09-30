import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import firebase from "firebase/app";
import "firebase/firestore";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function Followers() {

  const route = useRoute();
  const db = firebase.firestore();
  const { currentUser } = route.params;
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    (async () => {
      const followersRef = await db.collection("followers").where("followee", "==", currentUser.userName).get();
      followersRef.forEach((snapshot) => setFollowers((prevFollowers) => [...prevFollowers, snapshot.data()]));
    })();
  }, []);

  return (<>
    <View>
      <Text>Followers of {currentUser.userName}</Text>
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

