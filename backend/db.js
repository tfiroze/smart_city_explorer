// Connecting to a local database for testing

const mysql = require('mysql')

// create the connection with the MYSQL database
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'wenqing',
    database: 'nodejs'
})

// test if the connection is working or not
db.query('select 1', (err, results) => {
    if(err) console.log(err.message)
})

module.exports = db