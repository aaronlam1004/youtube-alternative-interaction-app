var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var logger = require('morgan');

var appRouter = require('./routes/index');

var app = express();

// Allow connections from React app (localhost:3000)
app.use(cors('http://localhost:3000'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', appRouter)

// 404 and error
app.use((req, res, next) => {
    next(createError(404));
});

// Error handling
app.use((err, req, res, next) => {
    // Show errors only in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err: {};

    // Render error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;