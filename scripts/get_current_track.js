export var current_song = "";
export var current_artist = "";

export async function get_track(access_token) {
  try {
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((response) => {
        const currentTrack = response;
        console.log("Song:", currentTrack["item"]["name"]);
        console.log("Album:", currentTrack["item"]["album"]["name"]);
        console.log(
          "Artist:",
          currentTrack["item"]["album"]["artists"][0]["name"]
        );
        current_song = currentTrack["item"]["name"];
        current_artist = currentTrack["item"]["album"]["artists"][0]["name"];
      });
  } catch (error) {
    console.log("Error:", error);
  }
}
