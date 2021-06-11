var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var users = require("./routes/users");
var selectMembers = require("./routes/members")
var valicate = require('./routes/valicate')
var issue = require('./routes/issue')
var video = require('./routes/video')
var moment = require('./routes/moment')
var reset = require('./routes/reset')
var error = require('./routes/problems')
var activity = require('./routes/activity')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', users);
app.use('/selectMember', selectMembers);
app.use('/valicate', valicate)
app.use('/issue', issue)
app.use('/video', video)
app.use('/moment', moment)
app.use('/reset', reset)
app.use('/activity', activity)
app.use('/error', error)
    // catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
process.env.PORT = 3000;

module.exports = app;