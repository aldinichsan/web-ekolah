const { connection } = require('mongoose');
const mysql = require('mysql');

// create connection

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "websekolah"
});

// connection
db.connect(err => {
    if(err) throw err;
    console.log("connection to mysql");
});

module.exports = db;