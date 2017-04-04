/**
 * Created by Kyle on 2017-04-04.
 */

var express = require('express');
var router = express.Router();
var db = require('../db');

var conn;

router.get('/', function(req,res,next){
    if(!(conn = db.get()))
        conn = db.connect();

    conn.query('SELECT vehicle_id as vid, position_latitude as lat, position_longitude as lng FROM vehicle_positions WHERE timestamp = (SELECT timestamp ' +
        'FROM vehicle_positions ORDER BY timestamp DESC LIMIT 1)', function(err, result){
        if(err){
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.render('error');
        }else
            res.send(result);
    });
});

module.exports = router;