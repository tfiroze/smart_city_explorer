// Test connection with database

const mysql = require('mysql2/promise');
const express = require('express');
const app = express();
const Client = require('ssh2').Client;

const ssh_host = '137.43.49.79';
const ssh_port = 22;
const ssh_username = 'student';
const ssh_password = 'Ucd-cs-2023!';

const mysql_user = 'root';
const mysql_password = 'Group@18';
const mysql_db = 'smartcityexplorer';

app.get('/', async (req, res) => {
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
          conn.query('SELECT * FROM venue_static').then(([rows]) => {
            res.json(rows);

            conn.end();
            // tunnel.end();
            conn.destroy();
          });
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
});

app.listen(3000, () => console.log('Server started on port 3000'));
