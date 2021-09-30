import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, Button } from 'react-native';
import { useRoute } from "@react-navigation/native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { userContext } from "../../contexts/userContext";

export default function Comments() {

  const db = firebase.firestore();
  const auth = firebase.auth();
  const route = useRoute();
  const { post, owner } = route.params;
  const commentCollection = db.collection("posts").doc(post.postID).collection("comments");
  const [user, setUser] = useContext(userContext);
  const [allComments, setAllComments] = useState([]);
  const [comment, setComment] = useState("");
  const commentInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      const comments = await commentCollection.get();
      setAllComments([]);
      comments.forEach((snapshot) => setAllComments((prevComments) => [...prevComments, snapshot.data()]));
    })();
  }, []);

  async function pushComment() {
    const postRef = db.collection("posts").doc(post.postID);
    const commentCount = (await postRef.get()).data().comments;
    const dateObj = new Date();
    const date = dateObj.getUTCDate();
    const month = dateObj.getUTCMonth();
    const year = dateObj.getUTCFullYear();
    const commentDoc = await commentCollection.add({
      comment,
      date,
      month,
      year,
      commentedBy: user.userName
    });
    await commentCollection.doc(commentDoc.id).update({
      commentID: commentDoc.id
    });
    let newCommentData = (await commentDoc.get()).data();
    await postRef.update({
      comments: commentCount + 1
    });
    setAllComments((commentsArr) => [...commentsArr, newCommentData]);
    commentInputRef.current.clear();
    commentInputRef.current.blur();
  };

  return (
    <View>
      <Text>Comment section</Text>
      <TextInput
        ref={commentInputRef}
        placeholder="Comment"
        onChangeText={(value) => setComment(value)}
      />
      <Button
        title="Enter comment"
        onPress={() => pushComment()}
      />
      <FlatList
        data={allComments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => <>
          <View>
            <Text>{item.comment}</Text>
          </View>
        </>}
        extraData={allComments}
      />
    </View>
  );
}
