import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { useRoute, useNavigation } from "@react-navigation/native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { userContext } from "../../contexts/userContext";

export default function Post() {

  const db = firebase.firestore();
  const auth = firebase.auth();
  const StackNavigation = useNavigation();
  const route = useRoute();
  const [user, setUser] = useContext(userContext);
  const { post, owner } = route.params;
  const likeCollection = db.collection("posts").doc(post.postID).collection("likes");
  const [like, setLike] = useState("");

  useEffect(() => {
    (async () => {
      const likes = await likeCollection.where("likedBy", "==", user.userName).get();
      likes.forEach((snapshot) => setLike(snapshot.data().likeID));
    })();
  }, []);

  async function toggleLike() {
    const postRef = db.collection("posts").doc(post.postID);
    const likes = (await postRef.get()).data().likes;

    if (!like) {
      const dateObj = new Date();
      const date = dateObj.getUTCDate();
      const month = dateObj.getUTCMonth();
      const year = dateObj.getUTCFullYear();
      const likeDoc = await likeCollection.add({
        likedBy: user.userName,
        date,
        month,
        year
      });
      await likeCollection.doc(likeDoc.id).update({
        likeID: likeDoc.id
      });
      await postRef.update({
        likes: likes + 1
      });
      setLike(likeDoc.id);
    } else {
      await likeCollection.doc(like).delete();
      await postRef.update({
        likes: likes - 1
      });
      setLike("");
    }
  };

  if (!user) return (<View>
    <Text>Loading...</Text>
  </View>);

  if (user) return (
    <View>
      <Text>This is a post</Text>
      <Image
        source={{
          uri: post.postImageURL,
          width: 200,
          height: 200
        }}
      />
      <Button
        title="Like"
        color={like ? "hsl(0, 60%, 40%)" : "hsl(0, 0%, 60%)"}
        onPress={() => toggleLike()}
      />
      <Button
        title="Open comments"
        onPress={() => StackNavigation.navigate("Comments", { post, owner })}
      />
    </View>
  );
};
