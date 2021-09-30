import React, { useState, useCallback, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Modal, FlatList, Image, useWindowDimensions, Pressable } from 'react-native';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useRoute, useFocusEffect, useNavigation } from "@react-navigation/native";
import { userContext } from "../../contexts/userContext";

export default function Profile() {

  const auth = firebase.auth();
  const db = firebase.firestore();
  const StackNavigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [flag, setFlag] = useState(false);
  const route = useRoute();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignContent: "center",
    },
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useContext(userContext);

  useEffect(() => {
    (async () => {
      setPosts([]);
      const postsDoc = await db.collection("posts").where("postBy", "==", user.userName).get();
      postsDoc.forEach((snapshot) => setPosts((previousPosts) => [...previousPosts, snapshot.data()]));
    })();
  }, [flag]);

  // useFocusEffect(() => {
  //   (async () => {
  //     setPosts([]);
  //     const postsDoc = await db.collection("posts").where("postBy", "==", user.userName).get();
  //     postsDoc.forEach((snapshot) => setPosts((previousPosts) => [...previousPosts, snapshot.data()]));
  //   })();
  // });

  useFocusEffect(() => {
    const newPost = route.params?.newPost;
    if (newPost) setFlag((oldFlag) => !oldFlag);
  });

  return (
    <View style={styles.container}>
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
            <Text>Hello modal</Text>
          </View>
          <Button
            title="Close modal"
            onPress={() => setModalVisible(false)}
          />
        </View>
      </Modal>
      <Text>{user.name}</Text>
      <Text>{user.email}</Text>
      <Text>{user.userName}</Text>
      <Button
        title="Followers"
      />
      <Button
        title="Following"
      />
      <Button
        title="Sign out"
        onPress={async () => {
          await auth.signOut();
          setUser({});
        }}
      />
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        renderItem={({ item, index }) => {
          return (
            <View>
              <Pressable
                onPressIn={() => StackNavigation.navigate("Post", {
                  post: item,
                  owner: user
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
          );
        }}
      />
    </View>
  );
};


