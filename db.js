/**
 * Created by Kyle on 2017-04-04.
 */

require('dotenv').config();

var mysql = require('mysql2');
var db;

function connect(){
    db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE
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