var express = require('express');
var router = express.Router();

var fs = require('fs');
var readline = require('readline');
var { google } = require('googleapis');
const { auth } = require('google-auth-library');
const { oauth2 } = require('googleapis/build/src/apis/oauth2');
var OAuth2 = google.auth.OAuth2;

const redirect_uri = "http://localhost:8080/callback";
const client_uri = "http://localhost:3000";
var SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];

var oauth2Client = null;

function refreshToken() {
    oauth2Client.refreshAccessToken((err, tokens) => {
        if (err) {
            console.log("Error while trying to get tokens. Error:", err);
        }
        oauth2Client.credentials = tokens;
        fs.writeFile('tokens.json', JSON.stringify(tokens), (err) => {
            if (err) { 
                console.log("Error while trying to write tokens. Error:", err);
            }
        });
    })
}

const TOKEN_ERR = "No access, refresh token, API key or refresh handler callback is set.";
function makeYoutubeRequest(category, opts, res) {
    var service = google.youtube('v3');
    var options = {
        auth: oauth2Client
    };

    for (let key of Object.keys(opts)) {
        options[key] = opts[key];
    }
    if (Object.keys(oauth2Client.credentials).length !== 0) {
        service[category].list(options, (err, response) => {
            if (err) {
                console.log("API returned an error.", err);
                if (err.message === TOKEN_ERR) {
                    refreshToken()
                    .then(() => {
                        return service[category].list(options, (err, response) => {
                            if (err) {
                                console.log("API returned an error.", err);
                                return;
                            }
    
                            if (response.status === 200) {
                                res.json(response.data);
                            }
                            else {
                                console.log(response);
                                res.status(response.status).end();
                            }
                        });
                    })
                    .catch((err) => {
                        console.log("Error!");
                        return;
                    }); 
                }
                return;   
            }
    
            else if (response.status === 200) {
                res.json(response.data);
            }
            else {
                console.log(response);
                res.status(response.status).end();
            }
        });
    }
}


router.get('*', (req, res, next) => {
    fs.readFile("client_secret.json", (err, content) => {
        if (err) {
            console.log("Error loading client secret file:", err);
            return;
        }

        var json = JSON.parse(content);
        var client_id = json.client_id;
        var client_secret = json.client_secret;
        oauth2Client = new OAuth2(client_id, client_secret, redirect_uri);
        fs.readFile("tokens.json", (err, tokens) => {
            if (err) {
                console.log("No tokens to use.");
            }
            else {
                oauth2Client.credentials = JSON.parse(tokens);                
            }
            next();
        });
    });
});

router.get('/login', (req, res, next) => {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log(authUrl);
    res.redirect(authUrl);
});

router.get('/logout', (req, res, next) => {
    oauth2Client.credentials = {};
    fs.unlinkSync("tokens.json");
    res.redirect(client_uri);
});

router.get('/callback', (req, res, next) => {
    var code = req.query.code;
    console.log(code);
    oauth2Client.getToken(code, (err, tokens) => {
        if (err) {
            console.log("Error while trying to get tokens", err);
            res.redirect(client_uri);
        }
        oauth2Client.credentials = tokens;
        fs.writeFile("tokens.json", JSON.stringify(tokens), (err) => {
            if (err) { throw err; }
            res.redirect(client_uri);
        });
    });
});

// Searching
router.get('/search/video/:query', (req, res, next) => {
    var q = req.params.query;
    var args = {
        part: "snippet",
        type: "video",
        q: q,
        maxResults: 20
    }
    makeYoutubeRequest("search", args, res);
});

router.get('/search/playlist/:query', (req, res, next) => {
    var q = req.params.query;
    var args = {
        part: "snippet",
        type: "playlist",
        q: q,
        maxResults: 20
    }
    makeYoutubeRequest("search", args, res);
});

router.get('/search/channel/:query', (req, res, next) => {
    var q = req.params.query;
    var args = {
        part: "snippet",
        type: "channel",
        q: q,
        maxResults: 10
    }
    makeYoutubeRequest("search", args, res);
});

// Retrieving
router.get('/video/:id', (req, res, next) => {
    var id = req.params.id;
    var args=  {
        part: "snippet",
        id: id
    }
    makeYoutubeRequest("videos", args, res);
});

router.get('/playlist/:id', (req, res, next) => {
    var id = req.params.id;
    var args=  {
        part: "snippet",
        id: id
    }
    makeYoutubeRequest("playlists", args, res);
});

router.get('/playlistItems/:id', (req, res, next) => {
    var id = req.params.id;
    var args=  {
        part: "snippet",
        playlistId: id
    }
    makeYoutubeRequest("playlistItems", args, res);
});

router.get('/channel/mine', (req, res, next) => {
    var args = {
        part: "snippet,contentDetails,statistics,brandingSettings",
        mine: true
    }
    makeYoutubeRequest("channels", args, res);
});

router.get('/channel/id/:id', (req, res, next) => {
    var id = req.params.id;
    var args = {
        part: "snippet,contentDetails,statistics,brandingSettings",
        id: id 
    }
    makeYoutubeRequest("channels", args, res);
});

router.get('/channel/name/:channelName', (req, res, next) => {
    var channelName = req.params.channelName;
    var args = {
        part: "snippet,contentDetails,statistics,brandingSettings",
        forUsername: channelName 
    }
    makeYoutubeRequest("channels", args, res);
});

module.exports = router;