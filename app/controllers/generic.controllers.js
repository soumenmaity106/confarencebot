const Generic = require('../models/generic.model');
// FETCH all CourseList
exports.findAll = (req, res) => {
    Generic.find()
        .then(generic => {
            if (generic.length <= 0) {
                return res.status(404).send({
                    message: "Course list Dtabase Empty "
                })
            }
            res.send({
                count: generic.length,
                generic: generic
            });
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
}

// FIND a Courselist
exports.findOne = (req, res) => {
    Generic.findById(req.params.GenericId)
        .then(generic => {
            if (!generic) {
                return res.status(404).send({
                    message: "generic not found with id " + req.params.genericId
                });
            }
            res.send(generic);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "generic not found with id " + req.params.genericId
                });
            }
            return res.status(500).send({
                message: "Error retrieving generic with id " + req.params.genericId
            });
        });
};


//Couselist Serach
exports.serach = (req, res) => {       
    var findCourseList = {};
    if(req.query.hasOwnProperty('question')){
        if (req.query.question.length > 0) {
            findCourseList.question = req.query.question;
        }
    }  
    if(req.query.hasOwnProperty('intent')){
        if (req.query.intent.length > 0) {
            findCourseList.intent = req.query.intent;
        }
    }  
   
    Generic.find(findCourseList)
        .then(generic => {
            if (generic.length <= 0) {
                return res.status(404).send({
                    message: "Sorry I don’t know the answer to your question. Please ask a different one."
                })
            }
            res.send({
                count: generic.length,
                generic: generic
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}