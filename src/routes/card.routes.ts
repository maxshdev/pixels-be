import { Router } from 'express';
import { paginationCards, showCards } from '../controllers/card.controller';

const router = Router();

// router.get('/cards', showCards);
router.get('/', paginationCards);

export default router;