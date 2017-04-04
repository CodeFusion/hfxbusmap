/**
 * Created by Kyle on 2017-04-04.
 */

require('dotenv').config();

var mysql = require('mysql2');
var db;

function connect(){
    db = mysql.createConnection({
        host: 'localhost',
        user: 'hfxbusses',
        password: 'alwayslate',
        database: 'hfxbusses'
    });
    return db;
}

function get(){
    return db;
}

function close(){
    if(db){
        db.close(function(err, result){
            db = null;
        });
    }
}
module.exports = {
    connect: connect,
    get: get,
    close: close
};