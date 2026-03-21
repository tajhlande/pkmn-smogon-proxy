import { Router } from 'express';
import { getStats } from '../controllers';
import { validateStats } from '../middleware/validation';

const router: Router = Router();

router.get('/', validateStats, getStats);

export default router;
