var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./app/config/database');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var expressValidator = require('express-validator');
var passport = require('passport');
var cookieSession = require('cookie-session');
//Connect Db
mongoose.connect(config.database,{ useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connect mongodb');
});

//Init app
var app = express();


//View Engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set Public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',express.static('uploads'));
//Get Page Model
var Page = require('./app/models/page');

//Get all pages pass to header.ejs
Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
    if (err) {
        console.log(err)
    } else {
        app.locals.pages = pages;
    }
})

// Set global errors variable
app.locals.errors = null;



//Body parse middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Express session middleware
app.use(cookieSession({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    //   cookie: { secure: true }
}))

// Express Validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },
    customValidators: {
        isImage: function (value, filename) {
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }
    }
}));

//passport config
require('./app/config/passport')(passport);


//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Express Message
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

app.get('*', function (req, res, next) {
    res.locals.cart = req.session.cart;
    res.locals.user = req.user || null
    next();
})

//Admin Routers Path
var pages = require('./app/adminroutes/pages');
var admin = require('./app/adminroutes/admin');
var adminusers = require('./app/adminroutes/dashboard');
var Upload = require("./app/adminroutes/upload");
var Setting = require("./app/adminroutes/settings.routes");
var User = require('./app/adminroutes/user.route');
var Confarencebot = require('./app/adminroutes/confarence.routes');

//Admin Routers Url
app.use('/', pages);
app.use('/admin', admin);
app.use('/admin/dashboard', adminusers);
app.use("/admin/upload",Upload);
app.use("/admin/setting",Setting);
app.use("/admin/user",User);
app.use("/admin/confarence",Confarencebot);



//Api Routes
require('./app/routes/generic.routes')(app);

//Start Server
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server starteed port' + port)
})

