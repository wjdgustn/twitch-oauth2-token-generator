const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const path = require('path');

const setting = require('./setting.json');

const app = express();

let options;
if(setting.USE_SSL) {
    options = {
        cert: fs.readFileSync(setting.SSL_CERT),
        key: fs.readFileSync(setting.SSL_KEY)
    }
}

app.get('/', (req, res, next) => {
    if(!req.query.scope) return res.send('need scope query');
    const redirect_url = `${req.protocol}://${req.hostname}/callback`;
    return res.redirect(`https://id.twitch.tv/oauth2/authorize?client_id=${setting.TWITCH_CLIENT_ID}&redirect_uri=${redirect_url}&response_type=token&scope=${req.query.scope == 'no' ? '' : req.query.scope}`);
});

app.get('/callback', (req, res, next) => {
    return res.sendFile(path.resolve('./token.html'));
});

// 서버 구동
let server;
if(setting.USE_SSL) {
    server = https.createServer(options, app).listen(setting.PORT, () => {
        console.log('보안 서버가 구동중입니다!');
    });
}
else {
    server = http.createServer(app).listen(setting.PORT, () => {
        console.log("서버가 구동중입니다!");
    });
}