const mongoose = require('mongoose');
const RegistrationSchema = mongoose.Schema({
    program: { type: String },
    coursename: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    address: { type: String},
    zipcode: { type: String },
    state: { type: String },
    city: { type: String },
    dob: { type: String },
    qualifications: { type: String },
    phone: { type: Number },
    email: { type: String },
    date: { type:Date, default: Date.now},
    confirmationid: { type: String},
})
module.exports = mongoose.model('Registrations', RegistrationSchema)