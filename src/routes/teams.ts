import { Router } from 'express';
import { getTeams } from '../controllers';
import { validateTeams } from '../middleware/validation';

const router: Router = Router();

router.get('/', validateTeams, getTeams);

export default router;
