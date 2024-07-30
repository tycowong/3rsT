import {
  Pressable,
  SafeAreaViewComponent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { getRecommendation } from "../scripts/drink_recommendation";
import {
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
} from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navigation from "../StackNavigator";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const LogInScreen = () => {
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: process.env.EXPO_PUBLIC_CLIENT_ID,
      clientSecret: process.env.EXPO_PUBLIC_CLIENT_SECRET,
      scopes: [
        "user-read-private",
        "user-read-currently-playing",
        "user-read-email",
      ],
      usePKCE: false,
      redirectUri: "exp://192.168.50.90:8081",
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      storeData("@access_token", access_token);
      getCurrentTrack(access_token);
    }
  }, [response]);

  const storeData = async (key, token) => {
    try {
      await AsyncStorage.setItem(key, token);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const getCurrentTrack = (access_token) => {
    fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        const currentTrack = response;
        console.log("Song:", currentTrack["item"]["name"]);
        console.log("Album:", currentTrack["item"]["album"]["name"]);
        console.log(
          "Artist:",
          currentTrack["item"]["album"]["artists"][0]["name"]
        );
        console.log(
          getRecommendation(
            currentTrack["item"]["name"],
            currentTrack["item"]["album"]["artists"][0]["name"]
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
          onPress={() => {
            promptAsync();
          }}
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
