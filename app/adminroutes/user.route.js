var express = require('express');
var router = express.Router();

var Register = require('../models/registration.model');


router.get("/",(req,res,next)=>{
    Register.find(function(err,registers){
        if(err){
            console.log(err);
            res.redirect('admin/dashbord')
        }
        res.render("admin/user",{
            registers:registers
        });
    })
    
})

router.get("/delete/:id",(req,res,next)=>{
    var id = req.params.id;

    Register.findByIdAndDelete(id, function (err) {

    })
        .then(
            req.flash('success', 'User Deleted')
        )
        .catch(err => {
            res.status(500).send({
                error: err
            })
        })
    res.redirect('/admin/user')

})




module.exports = router;