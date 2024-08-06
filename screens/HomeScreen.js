import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import {
  drinkRecommendation,
  getRecommendation,
} from "../scripts/drink_recommendation";
import { get_track } from "../scripts/get_current_track";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const HomeScreen = () => {
  var imageId = "";

  async function getPhoto(query, apiKey) {
    try {
      const requestSearch = await fetch(
        `https://api.pexels.com/v1/search?query=${query}%20cocktail&per_page=1`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );

      const responseSearch = await requestSearch.json();
      console.log(responseSearch["photos"][0]["id"]);
      imageId = responseSearch["photos"][0]["id"];

      const requestPhoto = await fetch(
        `https://api.pexels.com/v1/photos/${imageId}`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );

      const responseGet = await requestPhoto.json();
      console.log(responseGet["src"]["medium"]);

      let photo_url = responseGet["src"]["original"];
      setPhotoUrl(photo_url);
    } catch (error) {
      console.log("Error:", error);
    }
  }

  const [photo_url, setPhotoUrl] = useState(
    `https://api.pexels.com/v1/photos/${imageId}`
  );

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <View height={60}></View>
        <Image
          id="recommendation_image"
          height={350}
          width={350}
          source={photo_url}
        />
        <Text
          style={{
            color: "white",
            paddingTop: 20,
            fontWeight: "bold",
            fontSize: 40,
          }}
        >
          {drinkRecommendation["name"]}
        </Text>
        <View height={300} style={{ flexDirection: "row", padding: 30 }}>
          <FlashList
            data={drinkRecommendation["ingredients"]}
            renderItem={({ item }) => (
              <Text
                style={{
                  color: "white",
                  padding: 10,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {item["name"]}
              </Text>
            )}
            estimatedItemSize={200}
          />

          <FlashList
            data={drinkRecommendation["ingredients"]}
            renderItem={({ item }) => (
              <Text
                style={{
                  textAlign: "right",
                  color: "white",
                  padding: 10,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {item["measurement"]}
              </Text>
            )}
            estimatedItemSize={200}
          />
        </View>

        <Pressable
          style={{
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            flexDirection: "row",
            width: 200,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 25,
            backgroundColor: "#1DB954",
          }}
          onPress={() => {
            async function refresh() {
              await get_track(await AsyncStorage.getItem("@access_token"));
              await getRecommendation();
              await getPhoto(
                encodeURIComponent(drinkRecommendation["name"]),
                process.env.EXPO_PUBLIC_PEXEL_API_KEY
              );
            }

            refresh();
          }}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>Refresh Me</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;
