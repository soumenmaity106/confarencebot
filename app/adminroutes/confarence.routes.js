var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var csv = require("fast-csv");
var multer = require('multer')
var isAdmin = auth.isAdmin;

// Get newUser model
var Confarence = require('../models/confarencebot.model');
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage })


// Get User Index
router.get('/', isAdmin, function (req, res) {
    Confarence.find(function (err, confarences) {
        res.render('admin/confarence', {
            confarences: confarences
        });
    });
});

// // Get Add generic
router.get('/add-confarence', isAdmin, function (req, res) {
    res.render('admin/add_new_confarencebot', {

    });
});

router.post('/add-confarence',  function (req, res) {
    var event_no = Math.floor(100000 + Math.random() * 900000);
    var confarence = new Confarence({
        eventno:event_no,
        event_track:req.body.event_track,
        date:req.body.date,
        from:req.body.from,
        to:req.body.to,
        session_name:req.body.session_name,
        speaker_name:req.body.speaker_name
    });
    confarence.save()
    .then(result=>{
        // req.flash('success', 'Save Data')
        // res.redirect('/admin/confarence')
        console.log(result)
    })
    .catch(err=>{
        console.log(err)
    })


});



// // Post Add User
router.post('/add-generic', upload.single('myFile'), (req, res, next) => {
    var file = req.file.path
    var stream = fs.createReadStream(file);
    // res.send(file)
    // console.log(file)
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    csv
        .fromStream(stream, {
            headers: ["intent", "question", "answer"],
            ignoreEmpty: true
        })
        .on("data", function (data) {
            var generic = new Generic({
                intent: data['intent'],
                question: data['question'],
                answer: data['answer']
            });

            generic.save(function (error) {
                if (error) {
                    throw error;
                }
            });
        }).on("end", function () {
            req.flash('success', 'Generic Upload');
            res.redirect('/admin/generic');
        });

})

// //Get Edit User

router.get('/edit-confarence/:id', isAdmin, function (req, res) {
    var errors;
    if (req.session.errors)
        errors = req.session.errors;

    req.session.errors = null;

    Confarence.findById(req.params.id, function (err, p) {
        if (err) {
            console.log(err);
            res.redirect('/admin/confarence')
        } else {
            res.render('admin/edit_confarence', {
                errors: errors,
                event_track: p.event_track,
                date: p.date,
                from: p.from,
                to: p.to,
                session_name: p.session_name,
                speaker_name: p.speaker_name,
                id: p._id
            });
        }
    });


});

// Post Edit generic

router.post('/edit-generic/:id', function (req, res) {
    Generic.findByIdAndUpdate(req.params.id, {
        $set: {
            question: req.body.question,
            answer: req.body.answer,
        }
    }, { new: true })
        .then(generic => {
            if (!generic) {
                return res.status(404).send({
                    message: "generic not found with id " + req.params.id
                });
            }
            req.flash('success', 'Edited')
            res.redirect('/admin/generic')
        })
        .catch(err => {
            console.log(err)
        })
});

// Get Delete user 

router.get('/delete-confarence/:id', isAdmin, function (req, res) {
    var id = req.params.id;
    Confarence.findByIdAndDelete(id, function (err) {

    })
        .then(
            req.flash('success', 'Generic Deleted')
        )
        .catch(err => {
            res.status(500).send({
                error: err
            })
        })
    res.redirect('/admin/confarence')
});

//Export
module.exports = router;

