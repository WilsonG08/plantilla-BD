import app from './server.js'
import connection from './database.js';

// Se llama a la funcion de la conexion de la BD
connection()

app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
})
