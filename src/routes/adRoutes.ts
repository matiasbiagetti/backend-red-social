import { Router } from 'express';
import { getAds } from '../controllers/adController';

const router: Router = Router();

router.get('/', getAds);

export default router;
