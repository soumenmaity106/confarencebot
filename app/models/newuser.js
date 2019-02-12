var mongoose = require('mongoose');

//User Schema

var NewuserSchema = mongoose.Schema({
    user_name: {
        type:String,
        require:true
    },
    user_phone: {
        type:String
    },
    user_email: {
        type:String,
        require:true
    },
    user_company_name: {
        type:String,
        require:true
    },
    years_of_exp: {
        type:String,
        require:true
    },
    technical:{
        type:String,
        require:true
    },
    image: {
        type:String
    },

});

var Newusers = module.exports = mongoose.model('Newusers',NewuserSchema);