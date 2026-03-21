import { Router } from 'express';
import { getFormats } from '../controllers';
import { validateFormat } from '../middleware/validation';

const router: Router = Router();

router.get('/', validateFormat, getFormats);

export default router;
