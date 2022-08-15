const mysql = require('mysql');
const {promisify} = require('util');

const {database} = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {

    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('CONEXION PERDIDA');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('BD TIENE MUCHAS CONEXIONES');
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('DB ES REFUSED');
        }
    }

    if(connection) connection.release();
    console.log('DB is connected');
});

pool.query = promisify(pool.query);

module.exports = pool;