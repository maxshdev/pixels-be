import express from 'express';
import cors from 'cors';
import { AppDataSource } from './database'; // Importamos la conexión desde database.ts
import cardRoutes from './routes/card.routes';
import path from 'path';
import twig from 'twig';

// Inicializar la conexión a la base de datos
AppDataSource.initialize()
  .then(() => {
    console.log('Conexión a la base de datos establecida');
  })
  .catch((error) => {
    console.error('Error al conectar con la base de datos', error);
  });

const app = express();

// Middleware de CORS
app.use(cors());

// Configuración del motor de vistas
app.set('view engine', 'twig');
app.set('views', path.join(__dirname, 'views'));

twig.cache(false);

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rutas
app.use(cardRoutes);

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor ejecutándose en http://localhost:3000');
});