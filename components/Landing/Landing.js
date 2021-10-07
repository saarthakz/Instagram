import React, { useState, useEffect, useContext } from "react";
import { StatusBar, LogBox } from "react-native";
import Register from '../SignIn/Register';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "../../firebaseConfig";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Feed from "../Feed/Feed";
import AddPost from "../Add-Post/AddPost";
import NewUser from "../SignIn/NewUser";
import UserProfile from "../Profile/UserProfile";
import Search from "../Search/Search";
import { userContext } from "../../contexts/userContext";

export default function Landing() {

  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  if (firebase.apps.length == 0) firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const [user, setUser] = useContext(userContext);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const existingUser = await db.collection("users").doc(user.uid).get();
        setUser(existingUser.data());
      };
    });
  }, []);

  if (!user.userName) return (<>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen
          name="Register"
          children={() => <Register
          />}
        />
        <Stack.Screen
          name="NewUser"
          children={() => <NewUser
          />}
          options={{
            headerTitle: "New User"
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </>);

  if (user.userName) return (<>
    <StatusBar backgroundColor="black" />
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Feed"
          children={() => <Feed />}
        />
        <Tab.Screen
          name="Search"
          children={() => <Search />}
          options={{
            headerShown: false
          }}
        />
        <Tab.Screen
          name="Add"
          children={() => <AddPost
          />}
          options={{
            headerShown: false
          }}
        />
        <Tab.Screen
          name="UserProfile"
          children={() => <UserProfile
            setUser={setUser}
          />}
          options={{
            headerShown: false
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  </>);
}
