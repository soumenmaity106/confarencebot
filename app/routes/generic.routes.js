module.exports = function (app) {
    var generic = require('../controllers/generic.controllers');
    
    //Retrieve all CourseLists
    app.get('/api/generic', generic.findAll) 

    // Retrieve a single search
    app.get('/api/generic/search/?', generic.serach);

    // Retrieve a single generics by Id
    app.get('/api/generic/:genericId', generic.findOne);
}