var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app, db) {
    app.post('/v1/booster/add', urlencodedParser, function (req, res) {
        var ref = db.collection('booster').doc();
        db.collection('booster').doc(ref.id)
            .set(req.body)
            .then(doc => {
                console.log('New booster added')
                res.send({"res":"New booster added"})
                return doc
            })
            .catch(err => {
                console.log('Failed to add new booster')
                res.status(410).send({"res":"Failed to add new booster"})
                return err
            });
    });

    app.post('/v1/booster/getBoosterDetail', urlencodedParser, function (req, res) {
        var ref = db.collection('booster').doc(req.body.id)
        ref.get()
            .then(booster => {
                if (booster.exists) {
                    res.send(booster.data())
                }
                else {
                    res.status(410).send({ 'res': 'Booster not found' });
                }
                return booster
            })
            .catch(err => {
                console.log('Booster not found : ' + err)
                res.status(410).send({ 'error': err });
                return err
            });
    });


    app.post('/v1/booster/updateBoosterDetail', urlencodedParser, function (req, res) {
        var ref = db.collection('booster').doc(req.body.id)
        ref.get()
            .then(booster => {
                if (booster.exists) {
                    ref.update({
                        "name": req.body.name,
                        "type": req.body.type,
                        "content": req.body.content
                    })
                    .then((doc) => {
                        res.send({ 'res': 'Booster updated successfully' })
                        return doc
                    })
                    .catch(err => {
                        console.log('Error in updating booster : ' + err)
                        res.status(410).send({ 'error': err });
                        return err
                    });

                }
                else {
                    res.status(410).send({ 'res': 'Booster not found' });
                }
                return booster
            })
            .catch(err => {
                console.log('Booster not found : ' + err)
                res.status(410).send({ 'error': err });
                return err
            });
    });

    app.post('/v1/booster/deleteBooster', urlencodedParser, function (req, res) {
        var ref = db.collection('booster').doc(req.body.id)
        ref.get()
            .then(booster => {
                if (booster.exists) {
                    ref.delete()
                    .then(function () {
                        res.send({ 'res': 'Booster delete successfully' })
                        return
                    }).catch(function (error) {
                        console.error("Error removing document: ", error);
                    });
                }
                else {
                    res.status(410).send({ 'res': 'Booster not found' });
                }
                return booster
            })
            .catch(err => {
                console.log('Booster not found : ' + err)
                res.status(410).send({ 'error': err });
                return err
            });
    });


    app.post('/v1/booster/getAllBooster', urlencodedParser, function (req, res) {
        db.collection('booster').get()
            .then((snapshot) => {
                var prod = { boosterList : [] }
                snapshot.forEach((doc) => {
                    var p = doc.data()
                    p["id"] = doc.id
                    prod.boosterList.push(p);
                });
                res.send(prod);
                return doc
            })
            .catch((err) => {
                console.log('Error getting documents', err);
                res.status(410).send({"res" : 'Error getting documents'})
                return err
            });
    });
};
