import mysql, { Pool, PoolConfig } from 'mysql';
import config from './config';

// Define the database configuration type
interface DBConfig extends PoolConfig {
    multipleStatements: boolean;
}

//Database configuration
const dbConfig : DBConfig = {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    debug: config.db.debug,
    multipleStatements: true,
}

//Variable to hold the connection pool
let connection : Pool | null = null;

//Handle reconnectiong to the database
const handleDisconnect = (): void => {
    connection = mysql.createPool(dbConfig);

    connection.on('error', (err) => {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect(); //Reconnect if the connection is lost
        } else {
            throw err; //For other errors, throw to stop execution
        }
    })
}

//Initialize the connection
handleDisconnect();

export default connection;

