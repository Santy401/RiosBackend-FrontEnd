const sqlite3 = ('sqlite3').verbose();
const db = new sqlite3.Database('./DataBaseTask.db', (err) => {
    if (err) {
        console.error('error al conectar con la base de datos', err.message);
    } else {
        console.log('conexion con la base de datos establecida');
    }
});

export default { db };