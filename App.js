import React from "react";
import { LogBox } from "react-native";
import Landing from "./components/Landing/Landing";
import { UserProvider } from "./contexts/userContext";

export default function App() {

  LogBox.ignoreLogs([`Setting a timer for a long period`]);

  return (<>
    <UserProvider>
      <Landing />
    </UserProvider>
  </>);
};
