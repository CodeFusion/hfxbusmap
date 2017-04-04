require('dotenv').config();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var index = require('./routes/index');
var users = require('./routes/users');
var debug = require('./routes/debug');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/positions.json', debug);
app.use('/users', users);

var db = require('./db.js');
var conn;

//establish connection to db
if(!(conn = db.get()))
    conn = db.connect();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

io.on('connection', function(socket){
    console.log('Client connected');
    getLatestPositions(function (err, result){
       if(!err){
           socket.emit('position-update', result);
       }else{
           socket.emit('error', err);
       }
    });
    socket.on('disconnect', function(){
        console.log('Client disconnected');
    });
});

http.listen(3000, function(){
    console.log('listening on 3000');
});

function getLatestPositions(callback){
    conn.query('SELECT vehicle_id as vid, position_latitude as lat, position_longitude as lng FROM vehicle_positions WHERE timestamp = (SELECT timestamp ' +
        'FROM vehicle_positions ORDER BY timestamp DESC LIMIT 1)', function(err, result){
        if(err){
            callback(err, null);
        }else
            callback(null, result);
    });
}

module.exports = app;
