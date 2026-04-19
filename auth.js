const playdl = require('play-dl');

async function authSpotify() {
  await playdl.setToken({
    spotify: {
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
      market: 'CL'
    }
  });
}

module.exports = { authSpotify };