import { Request, Response } from 'express';
import { AppDataSource } from '../database';
import { Card } from '../models/Card';
import { Like } from 'typeorm';

// Repositorio de cartas
const cardRepository = AppDataSource.getRepository(Card);

// Controlador para obtener todas las cartas
export async function showCards(req: Request, res: Response): Promise<void> {
  try {
    const cards = await cardRepository.find();
    res.render('cards.twig', { cards });
  } catch (error) {
    res.status(500).send('Error al obtener las cartas');
  }
}

// Controlador para obtener todas las cartas con paginación, filtros y ordenación
export async function paginationCards(req: Request, res: Response): Promise<void> {
  try {
    // Extraer parámetros de consulta (query params)
    const {
      page = 1,
      limit = 20,
      name,
      rarity,
      attribute,
      species,
      cost,
      damage,
      version,
      orderBy
    } = req.query;
    
    // Crear objeto para filtros de búsqueda
    const filters: any = {};

    // Filtros de búsqueda (usando LIKE para coincidencias parciales en campos de texto)
    if (name) filters.name = Like(`%${name}%`);
    if (rarity) filters.rarity = rarity;
    if (attribute) filters.attribute = Like(`%${attribute}%`);
    if (species) filters.species = Like(`%${species}%`);
    if (cost) filters.cost = cost;
    if (damage) filters.damage = Like(`%${damage}%`);
    if (version) filters.version = Like(`%${version}%`);

    // Configurar el objeto de ordenación
    const order: any = {};
    if (orderBy && typeof orderBy === 'string') {
      // Se espera el formato: "campo_dirección", por ejemplo "rarity_ASC" o "name_DESC"
      const [field, direction] = orderBy.split('_');
      const allowedFields = ['rarity', 'name', 'cost'];
      if (allowedFields.includes(field) && (direction === 'ASC' || direction === 'DESC')) {
        order[field] = direction;
      }
    }

    // Calcular el desplazamiento (offset) en función de la página y el límite
    const offset = (Number(page) - 1) * Number(limit);

    // Realizar la consulta con filtros, ordenación y paginación
    const [cards, total] = await cardRepository.findAndCount({
      where: filters,
      order,
      take: Number(limit),
      skip: offset,
    });

    // Calcular el total de páginas
    const totalPages = Math.ceil(total / Number(limit));

    // Renderizar la vista enviando los datos y filtros actuales
    res.render('cards.twig', {
      cards,
      totalPages,
      currentPage: Number(page),
      limit: Number(limit),
      filters: { name, rarity, attribute, species, cost, damage, version, orderBy },
    });
  } catch (error) {
    console.error('Error al obtener las cartas:', error);
    res.status(500).send('Error al obtener las cartas');
  }
}