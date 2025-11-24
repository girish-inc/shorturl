import { Router } from 'express';
import { createLink, getLinks } from '../controllers/linkController.js';

const router = Router();

router.post('/', createLink);
router.get('/', getLinks);

export default router;

