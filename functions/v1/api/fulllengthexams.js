var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var admin = require('firebase-admin');

module.exports = function (app, db) {
    app.post('/v1/fullexam/addNotification', urlencodedParser, function (req, res) {
        var ref = db.collection(req.body.subject).doc(req.body.name)
        ref.get()
            .then(notif => {
                if (notif.exists) {
                    ref.update(
                        { notification: admin.firestore.FieldValue.arrayUnion(req.body.notification) },
                        {merge : true}
                    )
                    res.send({ "res": "New Notification updated" })
                }
                else {
                    ref.set(
                        { notification: admin.firestore.FieldValue.arrayUnion(req.body.notification) }
                    ).then(doc => {
                        console.log('New Notification added')
                        res.send({ "res": "New Notification added" })
                        return doc
                    })
                    .catch(err => {
                        console.log('Failed to add new exam')
                        res.status(410).send({ "res": "Failed to add notification" })
                        return err
                    });
                }
                return notif
            })
            .catch(err => {
                console.log('Failed to add new exam')
                res.status(410).send({ "res": "Failed to add notification" })
                return err
            });
    });

    app.post('/v1/fullexam/addSyllabus', urlencodedParser, function (req, res) {
        var ref = db.collection(req.body.subject).doc(req.body.name)
        ref.set(
            { syllabus: req.body.syllabus }
        ).then(doc => {
            console.log('New syllabus added')
            res.send({ "res": "New syllabus added" })
            return doc
        })
            .catch(err => {
                console.log('Failed to add new syllabus')
                res.status(410).send({ "res": "Failed to add syllabus" })
                return err
            });
    });

    app.post('/v1/fullexam/previousQuestionPaper', urlencodedParser, function (req, res) {
        var ref = db.collection(req.body.subject).doc(req.body.name)
        ref.get()
        .then(qpr => {
            if(qpr.exists)
            {
                ref.update(
                    { previousQuestionPaper: admin.firestore.FieldValue.arrayUnion(req.body.previousQuestionPaper) },
                    {merge : true}
                )
                .then(doc => {
                    console.log('New Question Paper added')
                    res.send({ "res": "New Question Paper added" })
                    return doc
                })
                .catch(err => {
                    console.log('Failed to add new Question Paper')
                    res.status(410).send({ "res": "Failed to add Question Paper" })
                    return err
                });
            }
            else
            {
                ref.set(
                    { previousQuestionPaper: admin.firestore.FieldValue.arrayUnion(req.body.previousQuestionPaper) }
                ).then(doc => {
                    console.log('New Question Paper added')
                    res.send({ "res": "New Question Paper added" })
                    return doc
                })
                .catch(err => {
                    console.log('Failed to add new Question Paper')
                    res.status(410).send({ "res": "Failed to add Question Paper" })
                    return err
                });
            }
            return qpr
        })
        .catch(err => {
            console.log('Failed to add Question Paper')
            res.status(410).send({ "res": "Failed to add Question Paper" })
            return err
        });    
    });



    // -------------  Exams Operations  ----------------

    app.post('/v1/fullexam/add', urlencodedParser, function (req, res) {
        var ref = db.collection(req.body.subject).doc(req.body.name)
        ref.set(req.body)
            .then(doc => {
                console.log('New Exam added')
                res.send({ "res": "New Exam added" })
                return doc
            })
            .catch(err => {
                console.log('Failed to add new exam')
                res.status(410).send({ "res": "Failed to add new exam" })
                return err
            });
    });

    app.post('/v1/fullexam/getExamDetails', urlencodedParser, function (req, res) {
        var ref = db.collection(req.body.subject).doc(req.body.name)
        ref.get()
            .then(exam => {
                if (exam.exists) {
                    res.send(exam.data())
                }
                else {
                    res.status(410).send({ 'res': 'Exam not found' });
                }
                return exam
            })
            .catch(err => {
                console.log('Exam not found : ' + err)
                res.status(410).send({ 'error': err });
                return err
            });
    });


    app.post('/v1/fullexam/delete', urlencodedParser, function (req, res) {
        var ref = db.collection(req.body.subject).doc(req.body.name)
        ref.get()
            .then(exam => {
                if (exam.exists) {
                    ref.delete()
                    .then(function () {
                        res.send({ 'res': 'Exam delete successfully' })
                        return
                    }).catch(function (error) {
                        console.error("Error removing document: ", error);
                    });
                }
                else {
                    res.status(410).send({ 'res': 'Exam not found' });
                }
                return exam
            })
            .catch(err => {
                console.log('Exam not found : ' + err)
                res.status(410).send({ 'error': err });
                return err
            });
    });


    app.post('/v1/fullexam/getAllExams', urlencodedParser, function (req, res) {
        db.collection(req.body.subject).get()
            .then((snapshot) => {
                var prod = { examList : [] }
                snapshot.forEach((doc) => {
                    var p = doc.data()
                    p["id"] = doc.id
                    prod.examList.push(p);
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

    app.post('/v1/fullexam/checkSubscribtion', urlencodedParser, function (req, res) {
        var ref = db.collection(req.body.subject).doc(req.body.name)
        ref.get()
            .then(exam => {
                if (exam.exists) {
                    var users = exam.data().registered_user
                    var flag = false
                    users.forEach(u => {
                        if(u === req.body.email)
                        {
                            flag = true
                        }
                    })
                    res.send({res : flag})
                }
                else {
                    res.status(410).send({ 'res': 'Exam not found' });
                }
                return exam
            })
            .catch(err => {
                console.log('Exam not found : ' + err)
                res.status(410).send({ 'error': err });
                return err
            });
    });


    app.post('/v1/fullexam/addSubscribtion', urlencodedParser, function (req, res) {
        var ref = db.collection(req.body.subject).doc(req.body.name)
        ref.get()
        .then(qpr => {
            if(qpr.exists)
            {
                ref.update(
                    { registered_user: admin.firestore.FieldValue.arrayUnion(req.body.email) },
                    {merge : true}
                )
                .then(doc => {
                    console.log('New Subscribtion added')
                    res.send({ "res": "New Subscribtion added" })
                    return doc
                })
                .catch(err => {
                    console.log('Failed to add new Subscribtion')
                    res.status(410).send({ "res": "Failed to add Subscribtionr" })
                    return err
                });
            }
            else
            {
                ref.set(
                    { registered_user: admin.firestore.FieldValue.arrayUnion(req.body.email) }
                ).then(doc => {
                    console.log('New Subscribtion added')
                    res.send({ "res": "New Subscribtion added" })
                    return doc
                })
                .catch(err => {
                    console.log('Failed to add new Subscribtion')
                    res.status(410).send({ "res": "Failed to add Subscribtion" })
                    return err
                });
            }
            return qpr
        })
        .catch(err => {
            console.log('Failed to add Subscribtion')
            res.status(410).send({ "res": "Failed to add Subscribtion" })
            return err
        });    
    });

};