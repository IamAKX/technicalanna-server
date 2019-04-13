var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app, db) {
    app.post('/v1/subjectexams/add', urlencodedParser, function (req, res) {
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

    app.post('/v1/subjectexams/getExamDetails', urlencodedParser, function (req, res) {
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


    app.post('/v1/subjectexams/delete', urlencodedParser, function (req, res) {
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


    app.post('/v1/subjectexams/getAllExams', urlencodedParser, function (req, res) {
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
};
