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
const Item = mongoose.model("users" , new mongoose.Schema({
    name: {type: String, require: true},
    email: String,
    contraseña: String
}));

// crear las rutas para el CRUD (CREATE, RELEAD, UPDATE, DELETE)

//Ruta para obtener todos los nombres con sus descripciones get optener
//http://localhost:5000/items
app.get("/items", async (req, res) => {
    const items = await Item.find(); // Obtenemos la lista de los nombres en formato JSON
    res.json(items);
});
// ruta para el CREAR post

app.post("/items", async (req, res) => {
    const newItem = new Item(req.body);
    await newItem.save();// guardar el usuario con el save en base de datos
    res.status(201).json(newItem); // enviamos los datos de usuario agregado en json
});

// Ruta para actualizar un elemento existente
app.put("/items/:id", async (req, res) => {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem); // Enviamos el elemento actualizado en formato JSON
});

// Ruta para eliminar un elemento
app.delete("/items/:id", async (req, res) => {
    await Item.findByIdAndDelete(req.params.id); // Eliminamos el elemento de la base de datos
    res.status(204).send(); // Enviamos un código de estado 204 sin contenido
});

// Configuramos el puerto y ponemos el servidor en escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});


