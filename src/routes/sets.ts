import { Router } from 'express';
import { getSets } from '../controllers';
import { validateSets } from '../middleware/validation';

const router: Router = Router();

router.get('/', validateSets, getSets);

export default router;
