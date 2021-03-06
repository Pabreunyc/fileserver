const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const jwt = require('./middlewares/jwt');

const indexRouter = require('./routes/index'),
  usersRouter = require('./routes/users'),
  dbRouter = require('./routes/db.router'),
  fileservicesRouter = require('./routes/fileservices.router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use( (req, res, next) => {
  //req.locals = configs;
  next();
})
app.use(cors());

app.use(jwt.checkToken);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/fileservice/v2', fileservicesRouter);
app.use('/fileservice', fileservicesRouter);
app.use('/db', dbRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const url = `${req.method}:${req.originalUrl}`;
  next(createError(404, url));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //res.status(err.status || 500);
  //res.render('error');
  res.status(err.status || 500).send( err.message);
});

module.exports = app;
