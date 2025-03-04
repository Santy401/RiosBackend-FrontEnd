import sqlite3 from 'sqlite3';
import path from 'path';


const DB_PATH = path.join(process.cwd(), 'DataBaseTask.db');


const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conexión con la base de datos establecida.');
    }
});

export default db;  
