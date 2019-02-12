var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;

var Reagister = require('../models/registration.model')

// Get Dshboard
router.get('/', isAdmin, function (req, res) {
    Reagister.countDocuments(function (err, c) {
            count = c      
    });
    Reagister.find(function(err,register){
        res.render('admin/dashboard',{
            register:register,
            count:count
        });
    })

    
});

//Export
module.exports = router;

