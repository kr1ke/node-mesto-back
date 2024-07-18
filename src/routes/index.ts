import { Router } from 'express';
import usersRouter from './users.router';
import cardsRouter from './cards.router';

const router = Router();

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

export default router;
