import React from 'react';
import { View, Text, Button } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

export default function UploadPost({ setImage }) {
  const PostStackNavigation = useNavigation();

  async function selectImage(PostStackNavigation) {

    const imageResult = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [1, 1]
    });
    if (imageResult.cancelled != true) {
      setImage(imageResult);
      PostStackNavigation.navigate("Caption");
    };
  };

  return (<>
    <View>
      <Text>Add Post here</Text>
      <Button
        title="Select an image"
        onPress={() => selectImage(PostStackNavigation)}
      />
    </View>
  </>);
};
