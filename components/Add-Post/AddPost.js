import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Caption from "./Caption";
import UploadPost from "./UploadPost";

export default function AddPost() {

  const Stack = createStackNavigator();
  const TabNavigation = useNavigation();
  const [image, setImage] = useState({});

  return (<>
    <Stack.Navigator
      initialRouteName="UploadPost"
    >
      <Stack.Screen
        name="UploadPost"
        children={() => <UploadPost
          setImage={setImage}
        />}
        options={{
          headerTitle: "Add Post"
        }}
      />
      <Stack.Screen
        name="Caption"
        children={() => <Caption
          TabNavigation={TabNavigation}
          image={image}
        />}
      />
    </Stack.Navigator>
  </>);
};
