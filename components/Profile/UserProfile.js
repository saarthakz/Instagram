import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import Post from "./Post";
import Profile from "./Profile";
import Comments from "./Comments";

export default function UserProfile() {

  const Stack = createStackNavigator();

  return (<>
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        children={() => <Profile />}
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
};
