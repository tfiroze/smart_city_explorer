
const mysql = require('mysql2/promise');
const express = require('express');
const app = express();
const Client = require('ssh2').Client;

const createSSHTunnel  = async (dbOperation) => {

    const ssh_host = '137.43.49.79';
    const ssh_port = 22;
    const ssh_username = 'student';
    const ssh_password = 'Ucd-cs-2023!';

    const mysql_user = 'root';
    const mysql_password = 'Group@18';
    const mysql_db = 'smartcityexplorer';

    const conn = new Client();

    conn.on('ready', () => {
        conn.forwardOut(
            '127.0.0.1',
            12345,
            '127.0.0.1',
            3306,
            (err, stream) => {
                if (err) throw err;
                
                const tunnel = mysql.createConnection({
                    user: mysql_user,
                    password: mysql_password,
                    database: mysql_db,
                    stream: stream
                });
                tunnel.then((conn) => {
                    dbOperation(conn)
                }).catch((err) => {
                    console.log(err);
                });
            }
        );
    });

    conn.connect({
        host: ssh_host,
        port: ssh_port,
        username: ssh_username,
        password: ssh_password
    });
}

module.exports = createSSHTunnel