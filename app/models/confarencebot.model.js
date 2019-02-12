var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var nameValidator = [
    validate({
        validator:'isLength',
        arguments:[1,250],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
    }),
   
]
//mongoose.set('useFindAndModify', false);
var ConfarenceSchema = mongoose.Schema({
    eventno:{type:String},
    event_track: { type: String},
    date: { type: String},  
    from:{type:String},
    to:{type:String},
    session_name:{type:String, validate:nameValidator},
    speaker_name:{type:String, validate:nameValidator }
});
var Confarence = mongoose.model('Confarence', ConfarenceSchema);
module.exports = Confarence;