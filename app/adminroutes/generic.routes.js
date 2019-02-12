var express = require('express');
var router = express.Router();
var fs = require('fs');
var auth = require('../config/auth');
var csv = require("fast-csv");
var multer = require('multer')
var isAdmin = auth.isAdmin;

// Get newUser model
var Generic = require('../models/generic.model');
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
    Generic.find(function (err, generics) {
        res.render('admin/generic', {
            generics: generics
        });
    });
});

// // Get Add generic
router.get('/add-generic', isAdmin, function (req, res) {
    res.render('admin/add_generic', {

    });
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
            headers: ["intent","question", "answer"],
            ignoreEmpty: true
        })
        .on("data", function (data) {
            var generic = new Generic({
                intent:data['intent'],
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

router.get('/edit-generic/:id', isAdmin, function (req, res) {
    var errors;
    if (req.session.errors)
        errors = req.session.errors;

    req.session.errors = null;

    Generic.findById(req.params.id, function (err, p) {
        if (err) {
            console.log(err);
            res.redirect('/admin/generic')
        } else {
            res.render('admin/edit_generic', {
                errors: errors,
                intent:p.intent,
                question: p.question,
                answer: p.answer,
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

router.get('/delete-generic/:id', isAdmin, function (req, res) {
    var id = req.params.id;
    Generic.findByIdAndDelete(id, function (err) {

    })
        .then(
            req.flash('success', 'Generic Deleted')
        )
        .catch(err => {
            res.status(500).send({
                error: err
            })
        })
    res.redirect('/admin/generic')
});

//Export
module.exports = router;

