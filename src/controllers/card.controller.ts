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

// Controlador para obtener todas las cartas
export async function paginationCards(req: Request, res: Response): Promise<void> {
  try {
    // Obtener los filtros desde los parámetros de la consulta
    const { page = 1, limit = 20, name, rarity, attribute, species, cost } = req.query;
    
    // Crear un objeto con los filtros
    const filters: any = {};

    // Aplicar filtros de texto usando LIKE para coincidencias parciales
    if (name) filters.name = Like(`%${name}%`);
    if (rarity) filters.rarity = rarity;
    if (attribute) filters.attribute = Like(`%${attribute}%`);
    if (species) filters.species = Like(`%${species}%`);
    if (cost) filters.cost = cost;

    // Calcular el desplazamiento (offset) y el límite
    const offset = (Number(page) - 1) * Number(limit);

    // Realizar la consulta con filtros y paginación
    const [cards, total] = await cardRepository.findAndCount({
      where: filters, // Aplicar filtros a la consulta
      take: Number(limit),
      skip: offset,
    });

    // Calcular el número total de páginas
    const totalPages = Math.ceil(total / Number(limit));

    // Renderizar la vista de cartas con los filtros y datos de paginación
    res.render('cards.twig', {
      cards,
      totalPages,
      currentPage: Number(page),
      limit: Number(limit),
      filters: { name, rarity, attribute, species, cost }, // Enviar los filtros a la vista
    });
  } catch (error) {
    console.error('Error al obtener las cartas:', error);
    res.status(500).send('Error al obtener las cartas');
  }
}