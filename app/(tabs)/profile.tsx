import { View, Text, Button, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { defaultStyles } from "../../constants/Styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from 'expo-image-picker'

const Page = () => {
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  const [firstname, setFirstname] = useState(user?.firstName);
  const [lastname, setLastname] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.emailAddresses[0].emailAddress);
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    if (!user) return;

    setFirstname(user.firstName);
    setLastname(user.lastName);
    setEmail(user.emailAddresses[0].emailAddress);
  }, [user]);

  const onSaveUser = async () => {
    try {
      if (!firstname || !lastname) return;

      await user?.update({
        firstName: firstname,
        lastName: lastname,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setEdit(false);
    }
  };

  const onCaptureImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.75,
      base64: true,
    });

    if (!result.canceled) {
      const base64 = `data:image/png;base64,${result.assets[0].base64}`;
      user?.setProfileImage({
        file: base64,
      });
    }
  };

  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Profile</Text>
        <Ionicons name="notifications-outline" size={26} />
      </View>

      {user && (
        <View style={styles.card}>
          <TouchableOpacity onPress={onCaptureImage}>
            <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {!edit && (
              <View style={styles.editRow}>
                <Text style={{ fontFamily: "mon-b", fontSize: 22 }}>
                  {firstname} {lastname}
                </Text>
                <TouchableOpacity onPress={() => setEdit(true)}>
                  <Ionicons
                    name="create-outline"
                    size={24}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
              </View>
            )}
            {edit && (
              <View style={styles.editRow}>
                <TextInput
                  placeholder="First Name"
                  value={firstname || ""}
                  onChangeText={setFirstname}
                  style={[defaultStyles.inputField, { width: 100 }]}
                />
                <TextInput
                  placeholder="Last Name"
                  value={lastname || ""}
                  onChangeText={setLastname}
                  style={[defaultStyles.inputField, { width: 100 }]}
                />
                <TouchableOpacity onPress={onSaveUser}>
                  <Ionicons
                    name="checkmark-outline"
                    size={24}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Text>{email}</Text>
          <Text>Since {user?.createdAt!.toLocaleDateString("hi-IN")}</Text>
        </View>
      )}

      {isSignedIn && (
        <Button title="Log Out" onPress={() => signOut()} color={Colors.dark} />
      )}
      {!isSignedIn && (
        <Link href={"/(modals)/login"} asChild>
          <Button title="Log In" color={Colors.dark} />
        </Link>
      )}
    </SafeAreaView>
  );
};

export default Page;
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    padding: 24,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    fontFamily: "mon-b",
    fontSize: 24,
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  editRow: {
    height: 50,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
