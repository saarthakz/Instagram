import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import FeedList from "./FeedList";
import Post from "../Profile/Post";
import Comments from "../Profile/Comments";

export default function Feed() {

  const Stack = createStackNavigator();

  return (<>
    <Stack.Navigator initialRouteName="FeedList">
      <Stack.Screen
        name="FeedList"
        children={() => <FeedList />}
      />
      <Stack.Screen
        name="Post"
        children={() => <Post />}
      />
      <Stack.Screen
        name="Comments"
        children={() => <Comments />}
      />
      <Stack.Screen
        name="Following"
        children={() => <></>}
      />
      <Stack.Screen
        name="Followers"
        children={() => <></>}
      />
    </Stack.Navigator>
  </>);
}
