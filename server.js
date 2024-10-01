require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mysql = require('mysql2');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const app = express();
app.use(cors());

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Configuración de Multer
const upload = multer({ dest: 'uploads/' });

// Configuración de la base de datos
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((error) => {
  if (error) throw error;
  console.log('Conectado a la base de datos');
});

// Endpoint para manejar el formulario
app.post('/upload', upload.single('imagen'), (req, res) => {
  const nombre = req.body.nombre;
  const email = req.body.email;
  const imagenLocalPath = req.file.path;

  // Subir imagen a Cloudinary
  cloudinary.uploader.upload(imagenLocalPath, (error, result) => {
    // Eliminar imagen local
    fs.unlinkSync(imagenLocalPath);

    if (error) {
      console.error(error);
      res.status(500).send('Error al subir la imagen');
    } else {
      const imagenUrl = result.secure_url;

      // Guardar datos en la base de datos
      const query = 'INSERT INTO clientes (nombre, email, imagen) VALUES (?, ?, ?)';
      connection.query(query, [nombre, email, imagenUrl], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send('Error al guardar los datos');
        } else {
          res.send('Datos guardados correctamente');
        }
      });
    }
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Node.js en funcionamiento en el puerto ${PORT}`);
});
