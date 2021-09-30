import React, { useState, useRef, useContext } from 'react';
import { View, Text, TextInput, Button, Modal } from 'react-native';
import { useRoute } from "@react-navigation/native";
import { userContext } from "../../contexts/userContext";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export default function NewUser() {

  const db = firebase.firestore();
  const auth = firebase.auth();
  const StackRoute = useRoute();
  const { data } = StackRoute.params;
  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const userNameInputRef = useRef(null);
  const [user, setUser] = useContext(userContext);

  async function signUp(userName) {
    if (!userName) {
      setUserNameError("Username can not be empty");
      setModalVisible(true);
      return;
    };
    const result = await db.collection("users").where("userName", "==", userName).get();
    if (!result.empty) {
      setUserNameError("User already exists");
      setModalVisible(true);
      userNameInputRef.current.clear();
    } else {
      data.userName = userName;
      await db.collection("users").doc(data.userID).set(data);
      setUser(auth.currentUser);
    };
  };

  return (
    <View>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
      >
        <View
          style={{
            marginHorizontal: 100,
            marginVertical: 100
          }}
        >
          <View
            style={{
              width: 200,
              height: 200,
              backgroundColor: "grey",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text>{userNameError}</Text>
          </View>
          <Button
            title="X"
            onPress={() => setModalVisible(false)}
          />
        </View >
      </Modal >
      <Text onPress={() => {
        userNameInputRef.current.blur();
        userNameInputRef.current.focus();
      }}>Enter a username</Text>
      <TextInput
        caretHidden={true}
        ref={userNameInputRef}
        onChangeText={(value) => {
          setUserName(value.split(" ").join("").trim().toLowerCase());
        }}
        style={{
          height: 1,
          color: "white"
        }}
      />
      <Text>{userName.toLowerCase()}</Text>
      <Button
        title="Get Started"
        onPress={() => signUp(userName)}
      />
    </View >
  );
};
