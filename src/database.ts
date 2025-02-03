import { DataSource } from 'typeorm';
import path from 'path';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'pixels-be-db',
  entities: [path.join(__dirname, '/models/*.ts')], // Ruta a las entidades
  synchronize: false, // Sincroniza las tablas automáticamente
  logging: true,
});