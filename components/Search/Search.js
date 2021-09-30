import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import SearchUser from "./SearchUser";
import FoundUser from "./FoundUser";
import Post from "../Profile/Post";

export default function Search() {

  const Stack = createStackNavigator();

  return (<>
    <Stack.Navigator initialRouteName="SearchUser">
      <Stack.Screen
        options={{
          headerTitle: "Search User"
        }}
        name="SearchUser"
        children={() => <SearchUser />}
      />
      <Stack.Screen
        options={({ navigation, route }) => ({
          headerTitle: route.params.userName,
          headerTitleAlign: "center"
        })}
        name="FoundUser"
        children={() => <FoundUser />}
      />
      <Stack.Screen
        name="FoundUserPost"
        children={() => <Post />}
      />
      <Stack.Screen
        name="PostComments"
        children={() => <></>}
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
