import {
  Pressable,
  SafeAreaViewComponent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import * as WebBrowser from "expo-web-browser";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

function Authenticate() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      issuer: "https://account.spotify.com",
      clientId: process.env.CLIENT_ID,
      socpes: ["user-read-currently-playing", "user-read-email"],
      usePKCE: false,
      redirectUri: "exp:localhost:19002/--/spotify-auth-callback",
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}

const LogInScreen = () => {
  return (
    <LinearGradient
      colors={["#040306", "#131624"]}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <SafeAreaView>
        <FontAwesome5
          style={{ textAlign: "center", marginLeft: 20 }}
          name="cocktail"
          size={70}
          color="white"
        />
        <View style={{ height: 20 }}></View>
        <Text
          style={{
            fontSize: 40,
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Are you 3rsT?
        </Text>
        <View style={{ height: 30 }}></View>
        <FontAwesome5
          style={{ textAlign: "center" }}
          name="arrow-down"
          size={40}
          color="white"
        />
        <View style={{ height: 20 }}></View>
        <Pressable
          style={{
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            flexDirection: "row",
            width: 300,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 25,
            backgroundColor: "#1DB954",
          }}
        >
          <FontAwesome5
            style={{ marginRight: 20 }}
            name="spotify"
            size={24}
            color="balack"
          />
          <Text style={{ fontSize: 18 }}>Sing In with Spotify</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LogInScreen;

const styles = StyleSheet.create({});
