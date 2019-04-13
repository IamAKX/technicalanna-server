const functions = require('firebase-functions')
const express = require('express')
const admin = require('firebase-admin')

var profile = require('./v1/api/profile')
var booster = require('./v1/api/booster')
var subjectexams = require('./v1/api/subjectexams')
var fulllengthexams = require('./v1/api/fulllengthexams')

admin.initializeApp(functions.config().firebase);
var db = admin.firestore();

const app = express()
app.get("/", (req,res) => {
    res.render(index,{});
});

const profileApp = express()
profile(profileApp,db)

const boosterApp = express()
booster(boosterApp,db)

const subjectExamsApp = express()
subjectexams(subjectExamsApp,db)

const fullLengthExamsApp = express()
fulllengthexams(fullLengthExamsApp,db)

exports.app = functions.https.onRequest(app);
exports.profileApp = functions.https.onRequest(profileApp);
exports.boosterApp = functions.https.onRequest(boosterApp);
exports.subjectExamsApp = functions.https.onRequest(subjectExamsApp);
exports.fullLengthExamsApp = functions.https.onRequest(fullLengthExamsApp);
