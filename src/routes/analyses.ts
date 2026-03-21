import { Router } from 'express';
import { getAnalyses } from '../controllers';
import { validateAnalyses } from '../middleware/validation';

const router: Router = Router();

router.get('/', validateAnalyses, getAnalyses);

export default router;
