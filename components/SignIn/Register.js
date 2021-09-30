import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StatusBar, Linking } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import clientIDs from '../../clientIDs';
import { userContext } from "../../contexts/userContext";

export default function Register() {
  const auth = firebase.auth();
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const db = firebase.firestore();
  const StackNavigation = useNavigation();
  const [user, setUser] = useContext(userContext);

  try {
    db.settings({ experimentalForceLongPolling: true });
  } catch (error) { };

  async function GoogleSignIn(StackNavigation) {
    const androidPackage = 'com.tangentmay.instagramapp';
    const scope = "email%20profile";
    const oAuthURI = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&response_type=code&redirect_uri=${androidPackage}%3A/oauth2redirect&client_id=${clientIDs.androidClientID}`;

    let responseCode;

    Linking.addEventListener("url", async (event) => {
      responseCode = event.url.split("code=")[1].split("&")[0];

      const tokenURl = "https://oauth2.googleapis.com/token";
      const body = `code=${responseCode}&client_id=${clientIDs.androidClientID}&redirect_uri=${androidPackage}%3A/oauth2redirect&access_type=offline&grant_type=authorization_code`;
      let fetchResponse = await fetch(tokenURl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body
      });
      const { id_token, access_token } = await fetchResponse.json();
      let credential;
      if (id_token) credential = googleProvider.credential(id_token, access_token);
      if (credential) {
        await auth.signInWithCredential(credential);
        let { email, displayName, uid } = auth.currentUser;
        let currentUser = (await db.collection("users").doc(uid).get()).data();
        if (!currentUser?.userName) {
          const data = {
            name: displayName,
            email: email,
            userName: null,
            photoURL: auth.currentUser.photoURL,
            followers: 0,
            following: 0,
            posts: 0,
            userID: uid
          };
          StackNavigation.navigate("NewUser", { data });
        } else {
          setUser(currentUser);
        };
      };
    });
    await Linking.openURL(oAuthURI);
  };

  return (<>
    <StatusBar backgroundColor="black" />
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Register Page</Text>
      <Button
        title="Login with Google"
        onPress={() => GoogleSignIn(StackNavigation)}
      />
    </View>
  </>);
};
