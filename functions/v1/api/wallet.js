var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app, db) {
    app.post('/v1/wallet/credit', urlencodedParser, function (req, res) {
        var ref = db.collection('users').doc(req.body.email)
        ref.get()
        .then(user =>{
            if(user.exists)
            {
                var amt = 0;
                if (typeof user.data().wallet_amt!== "undefined") {
                    amt = user.data().wallet_amt
                }
                amt = amt + req.body.amt
                ref.set({wallet_amt : amt}, { merge: true })
                .then(obj =>{
                    res.send({res : true});
                    return obj
                })
                .catch(err =>{
                    console.log('User not found : ' + err)
                    res.status(410).send({ 'error': err});
                    return err
                })
            }
            else{
                res.status(410).send({ 'error': 'User not found'});
            }
            return user
        })
        .catch(err => {
            console.log('User not found : ' + err)
            res.status(410).send({ 'error': err});
            return err
        });
    })

    app.post('/v1/wallet/debit', urlencodedParser, function (req, res) {
        var ref = db.collection('users').doc(req.body.email)
        ref.get()
        .then(user =>{
            if(user.exists)
            {
                var amt = 0;
                if (typeof user.data().wallet_amt!== "undefined") {
                    amt = user.data().wallet_amt
                }
                amt = amt - req.body.amt
                ref.set({wallet_amt : amt}, { merge: true })
                .then(obj =>{
                    res.send({res : true});
                    return obj
                })
                .catch(err =>{
                    console.log('User not found : ' + err)
                    res.status(410).send({ 'error': err});
                    return err
                })
            }
            else{
                res.status(410).send({ 'error': 'User not found'});
            }
            return user
        })
        .catch(err => {
            console.log('User not found : ' + err)
            res.status(410).send({ 'error': err});
            return err
        });
    })
    
    app.post('/v1/wallet/getWalletAmount', urlencodedParser, function (req, res) {
        var ref = db.collection('users').doc(req.body.email)
        ref.get()
        .then(user =>{
            if(user.exists)
            {
                res.send({"res" : user.data()})
            }
            else{
                res.status(410).send({ 'error': 'User not found.'});
            }
            return user
        })
        .catch(err => {
            console.log('User not found : ' + err)
            res.status(410).send({ 'error': err});
            return err
        });
    })

};