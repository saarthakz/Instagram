import React, { useContext } from 'react';
import { View, Text, TextInput, Image, useWindowDimensions, Button } from 'react-native';
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { userContext } from "../../contexts/userContext";

export default function Caption({ image, TabNavigation }) {
  const db = firebase.firestore();
  const auth = firebase.auth();
  const storageRoot = firebase.storage().ref();
  const rootRef = storageRoot.child("posts");
  const [caption, setCaption] = useState("");
  const [user, setUser] = useContext(userContext);
  const StackNavigation = useNavigation();

  async function confirmPost(StackNavigation, TabNavigation) {
    const imageData = await (await fetch(image.uri)).blob();
    const dateObj = new Date();
    const date = dateObj.getUTCDate();
    const month = dateObj.getUTCMonth();
    const year = dateObj.getUTCFullYear();
    StackNavigation.goBack();
    TabNavigation.navigate("Feed");

    const { id } = await db.collection("posts").add({
      postBy: user.userName,
      date,
      month,
      year,
      caption,
      likes: 0,
      comments: 0
    });
    const postRef = rootRef.child(id);

    postRef.put(imageData, {
      customMetadata: {
        postID: id,
        userID: user.userID
      }
    }).then(async (snapshot) => {
      const postImageURL = await snapshot.ref.getDownloadURL();
      await db.collection("posts").doc(id).update({ postImageURL, postID: id });
    });
  };

  return (<>
    <View>
      <Text>Caption Screen</Text>
      <TextInput
        onChangeText={(text) => setCaption(text)}
        style={{
          margin: 10,
          backgroundColor: "grey"
        }}
      />
      <Image
        source={{
          uri: image.uri,
          width: useWindowDimensions().width,
          height: useWindowDimensions().width
        }}
      />
      <Button
        title="Confirm Post"
        onPress={() => confirmPost(StackNavigation, TabNavigation)}
      />
    </View>
  </>);
}
