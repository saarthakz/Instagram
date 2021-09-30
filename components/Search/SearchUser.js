import React, { useState, useRef } from 'react';
import { View, Text, FlatList, Pressable, TextInput } from 'react-native';
import firebase from "firebase/app";
import "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function SearchUser() {
  const db = firebase.firestore();
  const StackNavigation = useNavigation();
  const [foundUsers, setFoundUsers] = useState([]);
  const searchInputRef = useRef(null);

  async function searchUser(userName) {
    const userQueryResults = await db.collection("users").where("userName", ">=", userName).get();
    setFoundUsers([]);
    userQueryResults.forEach((doc) => {
      setFoundUsers((prevUsers) => [...prevUsers, doc.data()]);
    });
  };

  return (<>
    <View>
      <TextInput
        ref={searchInputRef}
        onChangeText={(value) => {
          if (value.trim()) searchUser(value.trim());
          if (!value) setFoundUsers([]);
        }}
      />
      <Pressable
        onPressIn={() => {
          searchInputRef.current.clear();
          setFoundUsers([]);
        }}
      >
        <View>
          <Text>X</Text>
        </View>
      </Pressable>

      <FlatList
        data={foundUsers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (<>
            <View key={index}>
              <Pressable onPressIn={() => StackNavigation.navigate("FoundUser", { userName: item.userName })}
              >
                <Text>{item.userName}</Text>
              </Pressable>
            </View>
          </>);
        }}
      />
    </View>
  </>);
};
