import { Router } from 'express';
import { createLink, getLinks, deleteLink, getStats } from '../controllers/linkController.js';

const router = Router();

router.post('/', createLink);
router.get('/', getLinks);
router.get('/:code/stats', getStats);
router.delete('/:code', deleteLink);

export default router;

