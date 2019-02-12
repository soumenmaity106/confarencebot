var express = require('express');
var router = express.Router();
/*
* GET/
*/
router.get('/', function (req, res) {
    res.render('index', {
        Title: "Admin Login",
    });
});
//Export
module.exports = router; 