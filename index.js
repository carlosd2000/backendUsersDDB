const express = require ("express");
const mongoose = require ("mongoose");
const cors = require ("cors");// cors hace referencia a intercambiar informacion
require("dotenv").config();// carga las variables del entorno al inicio del archivo .env

// configurar el servidor de express
const app = express();
// middleware para analizar los json que se soliciten
app.use(express.json());
// habilitando el intercambio de informacion para permitir las diferentes solicitudes con el cors
app.use(cors());
//obtener la URI de MongoDb desde las variables del entorno
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, {
    // sila conencion del .env esta bien  que muestre un msj buenos
    useNewUrlParser: true,
    useUnifiedTopology: true
})
// then es como el if por ejempo
.then(()=> console.log("conexion exitosa a mongoDB"))
.catch((error) => console.error("error al conectar a la base de datos:" , error));
// creamos un modelos de mongoose para nuestros datos 
const Usuario = mongoose.model("users" , new mongoose.Schema({
    name: {type: String, require: true},
    email: String,
    contraseña: String,
    es_empresa: Boolean
}));


// crear las rutas para el CRUD (CREATE, RELEAD, UPDATE, DELETE)

//Ruta para obtener todos los nombres con sus descripciones get optener
//http://localhost:5000/Usuarios
app.get("/Usuarios", async (req, res) => {
    const Usuarios = await Usuario.find(); // Obtenemos la lista de los nombres en formato JSON
    res.json(Usuarios);
});
// ruta para el CREAR post

app.post("/Usuarios", async (req, res) => {
    const newUsuario = new Usuario(req.body);
    await newUsuario.save();// guardar el usuario con el save en base de datos
    res.status(201).json(newUsuario); // enviamos los datos de usuario agregado en json
});

// Ruta para actualizar un elemento existente
app.put("/Usuarios/:id", async (req, res) => {
    const updatedUsuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUsuario); // Enviamos el elemento actualizado en formato JSON
});

// Ruta para eliminar un elemento
app.delete("/Usuarios/:id", async (req, res) => {
    await Usuario.findByIdAndDelete(req.params.id); // Eliminamos el elemento de la base de datos
    res.status(204).send(); // Enviamos un código de estado 204 sin contenido
});

// Configuramos el puerto y ponemos el servidor en escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});


