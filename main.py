import json
import os
from requests import post, get
import base64
from dotenv import load_dotenv

load_dotenv()

def get_token():
    auth_string = f"{os.getenv('CLIENT_ID')}:{os.getenv('CLIENT_SECRET')}"
    auth_bytes = auth_string.encode("utf-8")

    # Base 64 Encodding
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")
    
    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {"grant_type" : "client_credentials"}
    result = post(url, headers=headers, data=data)
    json_result = json.loads(result.content)
    token = json_result["access_token"]
    return token

def get_auth_header(token):
    return {"Authorization": "Bearer " + token}

def get_current_track(token):
    current_track_url = "https://api.spotify.com/v1/me/player/currently-playing"
    headers = get_auth_header(token)

    result = get(current_track_url, headers=headers)
    json_result = json.loads(result.content)
    return json_result


def main():
    token = get_token()
    print(get_current_track(token))



if __name__ == '__main__':
    main()