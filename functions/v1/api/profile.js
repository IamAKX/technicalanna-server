var bodyParser = require('body-parser');
var md5 = require('md5');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var nodemailer = require('nodemailer');
var constants = require('../../utils/constants');


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
                                'isPhoneVerified': false,
                                'isEmailVerified': false,
                                'social': req.body.social,
                                'name': req.body.name,
                                'email': req.body.email,
                                'phone': req.body.phone,
                                'image': req.body.image,
                                'password': req.body.password
                            })
                                .then((doc) => {
                                    res.send({ 'user_id': uid, 'res': 'Profile updated with social login' })
                                    return doc
                                })
                                .catch(err => {
                                    console.log('Error in adding user : ' + err)
                                    res.status(410).send({ 'error': err });
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
                res.status(410).send({ 'error': err });
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
                        'image': req.body.image,
                        'password': req.body.password
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
        var ref = db.collection('users').get()
        ref.get()
            .then((snapShot) => {
                if (snapShot.empty) {
                    res.send({ 'users': {} })
                }
                else {
                    var userList = {}
                    ref.get()
                        .then(querySnapshot => {
                            querySnapshot.docs.forEach(doc => {
                                userList.push(doc.data());
                            })
                        return querySnapshot
                    })
                    .catch(err =>{
                        console.log('User not found : ' + err)
                        res.status(410).send({ 'error': err });
                        return err
                    })
                    res.send({ 'users': userList })
                }
                return snapShot
            })
            .catch(err => {
                console.log('User not found : ' + err)
                res.status(410).send({ 'error': err });
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
        console.log('constant',constants.gmail_user,constants.gmail_passwor)
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'ncpminds@gmail.com',
              pass: 'ncp@8600068568'
            }
          });
          
          var mailOptions = {
            from: constants.gmail_user,
            to: req.body.email,
            subject: 'Technical Anna Verification code',
            text: 'Your verification code to verify email address and sign in to Technical Anna is ${req.body.otp}.\nPlease do not share this email.'
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              res.status(410).send({'error':error})
            } else {
              console.log('Email sent: ' + info.response);
              res.send({'res':'Email sent to ${req.body.email}', 'info':info.response})
            }
          });
    });
};