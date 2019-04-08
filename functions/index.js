const functions = require('firebase-functions')
const express = require('express')
const admin = require('firebase-admin')

var profile = require('./v1/api/profile')

admin.initializeApp(functions.config().firebase);
var db = admin.firestore();

const app = express()
app.get("/", (req,res) => {
    res.render(index,{});
});

const profileApp = express()
profile(profileApp,db)

exports.app = functions.https.onRequest(app);
exports.profileApp = functions.https.onRequest(profileApp);
