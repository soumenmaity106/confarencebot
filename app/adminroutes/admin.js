var crypto = require('crypto');
var express = require('express');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var bcrypt = require('bcryptjs');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');

const option = {
    auth: {
        api_user: 'soumen.ncrt@gmail.com',
        api_key: 'Patibunia@556'
    }
}
const mailer = nodemailer.createTransport(sgTransport(option));

/*
* GET login
*/
router.get('/login', function (req, res) {
    if (res.locals.user) res.redirect('/')
    res.render('login')
});

/*
* Post Login
*/

router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/admin/dashboard',
        failureRedirect: '/admin/login',
        failureFlash: true
    })(req, res, next)
});

/*
* Get logout
*/
router.get('/logout', function (req, res) {
    req.logout();

    req.flash('success', 'You are log out');
    res.redirect('/admin/login')
})

/*
* Reset 
*/
router.get('/reset', function (req, res) {
    res.render('reset')
});

router.post('/reset', function (req, res, next) {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            res.redirect('/admin/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email }).then(
            user => {
                if (!user) {
                    req.flash('danger', 'No Email Found');
                    return res.redirect('/admin/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                user.save();
                mailer.sendMail({
                    to: req.body.email,
                    from: "project@support.com",
                    subject: "Password Reset",
                    html: `<p>Your requested password reset</p>
                                    <p>click a <a href="https://admin-edu.herokuapp.com/admin/reset/${token}">link </a>to set a new password</p>
                                `
                });
                req.flash('success', 'Check your Email Address');
                res.redirect('/admin/login');

            }
        ).catch(err => {
            console.log(err)
        })

    })

});

//Get Edit Edit
router.get('/reset/:token', function (req, res) {
    const token = req.param.token;
    User.findOne(token, function (err, p) {
        if (err) {
            console.log(err);
            res.redirect('/admin/login')
        } else {
            res.render('newpassword', {
                id: p._id,
                token: p.resetToken
            });
        }
    });


});

router.post("/new-password", (req, res, next) => {
    var newPassword = req.body.password;
    var userID = req.body.id;
    var Passwordtoken = req.body.token;
    let restuser

    User.findOne({
        resetToken: Passwordtoken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userID
    }).then(
        user => {
            restuser = user;
            return bcrypt.hash(newPassword, 12);
        }
    ).then(
        hashedPassword => {
            restuser.password = hashedPassword;
            restuser.resetToken = undefined;
            restuser.resetTokenExpiration = undefined;
            return restuser.save()
        }
    ).then(
        result => {
            req.flash('success', 'Password Change Success Fully');
            res.redirect('/admin/login')
        }
    ).catch(err => {
        console.log(err)
    })
})

//Export
module.exports = router; 