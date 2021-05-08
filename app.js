
const express = require('express');
const session = require('express-session');
const path = require('path');
const pageRouter = require('./routes/pages');
const postsRouter = require('./routes/posts');
const app = express();

// For body parser
app.use(express.urlencoded({extended: false}));

// Serve static files.
app.use(express.static(path.join(__dirname, 'public')));

// Template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Session
// maxAge - time that session is saved [ms]
app.use(session({
    secret: 'apiary',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}));

// Routers
app.use('/', pageRouter);
app.use('/', postsRouter);

// Errors : page not found 404
app.use((req, res, next) => {
    var err = new Error('Page not found');
    err.status = 404;
    next(err);
});

// handling errors
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
});

// Setting up the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});

module.exports = app;
