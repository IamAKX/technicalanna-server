var bodyParser = require('body-parser');
var md5 = require('md5');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const sgMail = require('@sendgrid/mail');
var constants = require('../../utils/constants');

sgMail.setApiKey('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');


module.exports = function (app, db) {
    app.post('/v1/profile/register', urlencodedParser, function (req, res) {
        var ref = db.collection('users').doc(req.body.email)
        ref.get()
            .then((oldUser) => {
                var uid = md5(req.body.email)
                if (oldUser.exists) {
                    if (req.body.type === 'email') {
                        res.status(410).send({ 'user': oldUser.data(), 'res': 'Email address already registered' })
                    }
                    else
                        if (req.body.type === 'social') {
                            ref.update({
                                'user_id': uid,
                                'isPhoneVerified': true,
                                'isEmailVerified': true,
                                'social': req.body.social,
                                'name': req.body.name,
                                'email': req.body.email,
                                'phone': req.body.phone,
                                'image': req.body.image,
                                'type': req.body.type,
                                'password': req.body.password
                            })
                                .then((doc) => {
                                    res.send({ 'user_id': uid, 'res': 'Profile updated with social login' })
                                    return doc
                                })
                                .catch(err => {
                                    console.log('Error in adding user : ' + err)
                                    res.status(410).send({ 'error': err ,'pos':1});
                                    return err
                                });
                        }
                }
                else {
                    req.body.user_id = uid
                    req.body.isPhoneVerified = false
                    req.body.isEmailVerified = false
                    req.body.accountCreateDate = new Date().toUTCString()
                    ref.set(req.body)
                    res.send({ 'user_id': uid, 'res': 'Registeration successful' })
                }
                return oldUser
            })
            .catch(err => {
                console.log('Error in adding user : ' + err)
                res.status(410).send({ 'error': err ,'pos':2});
                return err
            });
    });

    app.post('/v1/profile/updateProfile', urlencodedParser, function (req, res) {
        var ref = db.collection('users').doc(req.body.email)
        ref.get()
            .then(oldUser => {
                if (oldUser.exists) {
                    ref.update({
                        'name': req.body.name,
                        'phone': req.body.phone,
                        'image': req.body.image
                    })
                        .then((doc) => {
                            res.send({ 'res': 'Profile updated successfully' })
                            return doc
                        })
                        .catch(err => {
                            console.log('Error in updating user : ' + err)
                            res.status(410).send({ 'error': err });
                            return err
                        });
                }
                else {
                    res.status(410).send({ 'res': 'User does not exits' });
                }
                return oldUser
            })
            .catch(err => {
                console.log('Error in updating user : ' + err)
                res.status(410).send({ 'error': err });
                return err
            });
    });

    app.post('/v1/profile/setPhoneVerified', urlencodedParser, function (req, res) {
        var ref = db.collection('users').doc(req.body.email)
        ref.get()
            .then(oldUser => {
                if (oldUser.exists) {
                    ref.update({
                        'isPhoneVerified': true
                    })
                        .then((doc) => {
                            res.send({ 'res': 'Phone is verified' })
                            return doc
                        })
                        .catch(err => {
                            console.log('Error in updating phone verification status : ' + err)
                            res.status(410).send({ 'error': err });
                            return err
                        });
                }
                else {
                    res.status(410).send({ 'res': 'User does not exits' });
                }
                return oldUser
            })
            .catch(err => {
                console.log('Error in updating user : ' + err)
                res.status(410).send({ 'error': err });
                return err
            });
    });

    app.post('/v1/profile/setEmailVerified', urlencodedParser, function (req, res) {
        var ref = db.collection('users').doc(req.body.email)
        ref.get()
            .then(oldUser => {
                if (oldUser.exists) {
                    ref.update({
                        'isEmailVerified': true
                    })
                        .then((doc) => {
                            res.send({ 'res': 'Email is verified' })
                            return doc
                        })
                        .catch(err => {
                            console.log('Error in updating email verification status : ' + err)
                            res.status(410).send({ 'error': err });
                            return err
                        });
                }
                else {
                    res.status(410).send({ 'res': 'User does not exits' });
                }
                return oldUser
            })
            .catch(err => {
                console.log('Error in updating user : ' + err)
                res.status(410).send({ 'error': err });
                return err
            });
    });

    app.post('/v1/profile/getProfileDetail', urlencodedParser, function (req, res) {
        var ref = db.collection('users').doc(req.body.email)
        ref.get()
            .then(oldUser => {
                if (oldUser.exists) {
                    res.send(oldUser.data())
                }
                else {
                    res.status(410).send({ 'res': 'User does not exits' });
                }
                return oldUser
            })
            .catch(err => {
                console.log('User not found : ' + err)
                res.status(410).send({ 'error': err });
                return err
            });
    });

    app.post('/v1/profile/getAllUsers', urlencodedParser, function (req, res) {
        db.collection('users').get()
            .then((snapshot) => {
                var prod = { users : [] }
                snapshot.forEach((doc) => {
                    var p = doc.data()
                    p["id"] = doc.id
                    prod.users.push(p);
                });
                res.send(prod);
                return doc
            })
            .catch((err) => {
                console.log('Error getting documents', err);
                res.status(410).send({"res" : 'Error getting users'})
                return err
            });
    });

    app.post('/v1/profile/deleteAccount', urlencodedParser, function (req, res) {
        var ref = db.collection('users').doc(req.body.email)
        ref.get()
            .then(oldUser => {
                if (oldUser.exists) {
                    ref.delete()
                        .then(function () {
                            res.send({ 'res': 'Account delete successfully' })
                            return
                        }).catch(function (error) {
                            console.error("Error removing document: ", error);
                        });
                }
                else {
                    res.status(410).send({ 'res': 'User does not exits' });
                }
                return oldUser
            })
            .catch(err => {
                console.log('User not found : ' + err)
                res.status(410).send({ 'error': err });
                return err
            });
    });


    app.post('/v1/profile/triggerOtpEmail', urlencodedParser, function (req, res) {
        
        const msg = {
            to: req.body.email,
            from: 'ncpminds@gmail.com',
            subject: 'OTP Verification for Technical Anna',
            text: 'Hi,\nOTP code for email verification is '+req.body.otp,
        };
        sgMail.send(msg);
        res.send({'res':'Email sent'});
    });

    app.post('/v1/profile/login', urlencodedParser, function (req, res) {
        var ref = db.collection('users').doc(req.body.email)
        ref.get()
            .then(oldUser => {
                if (oldUser.exists) {
                    if(oldUser.data().password === "")
                    {
                        res.send({'res':'Your last login is with '+ oldUser.data().social +' account. Please login with same and update password to use email password.', 'user':oldUser.data()})
                    }
                    else
                    if(oldUser.data().password === req.body.password)
                    {
                        res.send({'res':'success', 'user':oldUser.data()})
                    }
                    else
                    {
                        res.status(410).send({ 'res': 'Password is incorrect' });
                    }
                }
                else {
                    res.status(410).send({ 'res': 'This is not registered email id' });
                }
                return oldUser
            })
            .catch(err => {
                console.log('User not found : ' + err)
                res.status(410).send({ 'error': err });
                return err
            });
    });

    app.post('/v1/profile/updatePassword', urlencodedParser, function (req, res) {
        var ref = db.collection('users').doc(req.body.email)
        ref.get()
            .then(oldUser => {
                if (oldUser.exists) {
                    ref.update({
                        'password': req.body.password
                    })
                        .then((doc) => {
                            res.send({ 'res': 'Password is updated successfully' })
                            return doc
                        })
                        .catch(err => {
                            console.log('Error in updating password : ' + err)
                            res.status(410).send({ 'error': err });
                            return err
                        });
                }
                else {
                    res.status(410).send({ 'res': 'User does not exits' });
                }
                return oldUser
            })
            .catch(err => {
                console.log('Error in updating user : ' + err)
                res.status(410).send({ 'error': err });
                return err
            });
    });
};