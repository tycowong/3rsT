from datetime import datetime
import urllib.parse
from flask import Flask, redirect, request, jsonify, session
import os
import urllib
from requests import post, get
from dotenv import load_dotenv

app = Flask(__name__)
app.secret_key = 'testing'

load_dotenv()

CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')

REDIRECT_URL = 'http://localhost:5000/callback'
TOKEN_URL = 'https://accounts.spotify.com/api/token'
AUTH_URL = 'https://accounts.spotify.com/authorize'
API_BASE_URL = 'https://api.spotify.com/v1/'


@app.route('/')
def index ():
    return "Welcome to 3rsT <a href='/login'>Log in with Spoity</a>"

@app.route('/login')
def login():
    scope = 'user-read-private user-read-email user-read-currently-playing'

    params = {
        'client_id' : CLIENT_ID,
        'response_type': 'code',
        'scope': scope,
        'redirect_uri': REDIRECT_URL,
        'show_dialog' : True
    }

    auth_url = f"{AUTH_URL}?{urllib.parse.urlencode(params)}"

    return redirect(auth_url)

@app.route('/callback')
def callback():
    if 'error' in request.args:
        return jsonify({"error": request.args['error']})
    
    if 'code'in request.args:
        req_body = {
            'code' : request.args['code'],
            'grant_type' : 'authorization_code',
            'redirect_uri': REDIRECT_URL,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
        }
        
        response = post(TOKEN_URL, data=req_body)
        token_info = response.json()

        session['access_token'] = token_info['access_token']
        session['refresh_token'] = token_info['refresh_token']
        session['expires_at'] = datetime.now().timestamp() + token_info['expires_in']

        return redirect('/current_song')
    
@app.route('/current_song')
def get_current_song():
    if 'access_token' not in session:
        return redirect('/login')

    if datetime.now().timestamp() > session['expires_at']:
        return redirect('/refresh-token')
    
    headers = {
        'Authorization': f"Bearer {session['access_token']}",
    }

    response = get(API_BASE_URL + 'me/player/currently-playing', headers=headers)
    current_song = response.json()

    return jsonify({
        'Song' : current_song['item']['name'],
        'Album' : current_song['item']['album']['name'],
        'Artist' : current_song['item']['album']['artists'][0]['name']

    })
    #return f"Artist: {current_song['item']['album']['artists']['name']}\nAlbum: {current_song['item']['album']['name']}\nSong: {current_song['item']['name']}"

@app.route('/refresh-token')
def refresh_token():
    if 'refresh_token' not in session:
        return redirect('/login')
    
    if datetime.now().timestamp() > session['expires_at']:
        req_body = {
            'grant_type' : 'refresh_token',
            'refresh_token' : session['refresh_token'],
            'client_id': CLIENT_ID,
            'client_secret' : CLIENT_SECRET
        }

        response = post(TOKEN_URL, data=req_body)
        new_token_info = response.json()

        session['access_token'] = new_token_info['access_token']
        session['expires_at'] = datetime.now().timestamp() + new_token_info['expires_in']

        return redirect('/current_song')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)