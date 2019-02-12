var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var bcrypt = require('bcryptjs');

var isAdmin = auth.isAdmin;

var User = require('../models/user');

router.get("/", isAdmin, (req, res, next) => {
    res.render('admin/change_password')
})


router.post("/check", (req, res, next) => {
    User.find({ admin: 1 })
        .then(user => {
            bcrypt.compare(req.body.old_password, user[0].password, (err, result) => {
                if (!result) {
                    console.log(err)
                    req.flash('danger', 'Old  Password Not Match');
                    return res.redirect("/admin/setting")
                }
                if (result) {
                    var newpassword = req.body.new_password;
                    var confirmpassword = req.body.confirm_password;
                    if (newpassword === confirmpassword) {
                        bcrypt.hash(confirmpassword, 10, (err, hash) => {
                            if (err) {
                                console.log(err)
                                return res.redirect("/admin/setting")
                            } else {
                                User.updateOne({ 'admin': 1 }, { $set: { 'password': hash } })
                                    .then(result => {
                                        req.flash('success', 'Password Change Suceefully');
                                        return res.redirect("/admin/setting");
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        return res.redirect("/admin/setting")
                                    })
                            }

                        })
                    } else {
                        req.flash('danger', 'Password Not Match');
                        return res.redirect("/admin/setting");
                    }
                }
            })

        })
        .catch(err => {
            console.log(err)
        })
   
})



module.exports = router;