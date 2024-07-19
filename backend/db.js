// Login information for root user:
    // email: root@example.com
    // password: root_pwd

const mysql = require('mysql2/promise');
const Client = require('ssh2').Client;

// const createSSHTunnel  = async (dbOperation) => {

//     const ssh_host = '137.43.49.79';
//     const ssh_port = 22;
//     const ssh_username = 'student';
//     const ssh_password = 'Ucd-cs-2023!';

//     const mysql_user = 'root';
//     const mysql_password = 'Group@18';
//     const mysql_db = 'smartcityexplorer';

//     const conn = new Client();

//     conn.on('ready', () => {
//         conn.forwardOut(
//             '127.0.0.1',
//             12345,
//             '127.0.0.1',
//             3306,
//             (err, stream) => {
//                 if (err) throw err;
                
//                 const tunnel = mysql.createConnection({
//                     user: mysql_user,
//                     password: mysql_password,
//                     database: mysql_db,
//                     stream: stream
//                 });
//                 tunnel.then((conn) => {
//                     dbOperation(conn)
//                     conn.end()
//                     conn.destroy()
//                     conn.on('end', () => {});
//                 }).catch((err) => {
//                     console.log(err);
//                 });
//             }
//         );
//     });

//     conn.connect({
//         host: ssh_host,
//         port: ssh_port,
//         username: ssh_username,
//         password: ssh_password
//     });
// }

// const dbConfig = {
//     host: 'localhost',   // The hostname of your database server
//     user: 'root',   // The username to access the database
//     password: 'root',   // The password to access the database
//     database: 'smartcityexplorer'   // The name of the database you want to connect to
// };

// const createSSHTunnel = mysql.createConnection(dbConfig);

// // Connect to the database
// // connection.connect(err => {
// //     if (err) {
// //         console.error('Error connecting to the database:', err);
// //         return;
// //     }
// //     console.log('Connected to the MySQL server.');
// // });


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',             // Replace with your MySQL username
    password: 'root',             // Replace with your MySQL password
    database: 'smartcityexplorer', // Replace with your MySQL database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = {
    getConnection: () => pool.getConnection()
};

// module.exports = createSSHTunnel