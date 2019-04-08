var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});

module.exports = function(app,db)
{
    app.post('/v1/profile/register', urlencodedParser, function(req, res){
        var ref = db.collection('users').doc();
        req.body.user_id = ref.id
        req.isPhoneVerified = false
        req.isEmailVerified = false
        req.accountCreateDate = new Date().toUTCString()
        req.social = []
        db.collection('users').doc(ref.id)
            .set(req.body)
            .then((doc) => {
                console.log('New user added : ' + ref)
                res.send({'user' : doc})
                return doc
            })
            .catch(err => {
                console.log('Error in adding user : ' + err)
                res.status(410).send({ 'error' : err });
                return err
            });
    });

    app.get('/v1/profile/test',function(req, res){
        res.send("OK")
    })
};