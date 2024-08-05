import { Text, Pressable } from "react-native";
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

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const HomeScreen = () => {
  const [photo_url, setPhotoUrl] = useState(
    "https://images.theconversation.com/files/38926/original/5cwx89t4-1389586191.jpg"
  );

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
      let imageId = responseSearch["photos"][0]["id"];

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

  return (
    <LinearGradient
      colors={["#040306", "#131624"]}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SafeAreaView>
        <Image
          id="recommendation_image"
          height={350}
          width={350}
          source={photo_url}
        />
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
          onPress={() => {
            async function refresh() {
              await get_track(await AsyncStorage.getItem("@access_token"));
              await getRecommendation();
              await getPhoto(
                drinkRecommendation["name"],
                process.env.EXPO_PUBLIC_PEXEL_API_KEY
              );
            }

            refresh();
          }}
        >
          <Text>Click hello Now</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;
