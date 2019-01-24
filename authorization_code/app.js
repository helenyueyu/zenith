var express = require('express')
var request = require('request')
var cors = require('cors')
var querystring = require('querystring')
var cookieParser = require('cookie-parser')

var client_id = '81db82c72c3645b9a94f7d9f3a2bab6e'
var client_secret = 'beb94c0f9d3d455293727a08644bf9db'
var redirect_uri = 'http://localhost:8888/callback'

var generateRandomString = function(length) {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

var stateKey = 'spotify_auth_state'
var app = express()

app.use(express.static(__dirname, + '/public'))
  .use(cors())
  .use(cookieParser())

app.get('/login', function(req, res) {
  var state = generateRandomString(16)
  res.cookie(stateKey, state)

  var scope = 'user-read-private user-read-email'
  res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
    response_type: 'code',
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state
  }))
})

app.get('/callback', function(req, res) {
  var code = req.query.code || null
  var state = req.query.state || null
  var storedState = req.cookies ? req.cookies[stateKey] : null

  if (state === null || state !== storedState) {
    res.redirect('/#' + querystring.stringify({
      error: 'state_mismatch'
    }))
  } else {
    res.clearCookie(stateKey)
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    }

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
           refresh_token = body.refresh_token

        var options = {
          
        }
      }
    })
  }
})
