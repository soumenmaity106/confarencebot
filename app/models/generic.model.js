var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var GenericSchema = mongoose.Schema({
    intent:{type:String},
    question: { type: String},
    answer: { type: String},    
});
var Generic = mongoose.model('Generic', GenericSchema);
module.exports = Generic;