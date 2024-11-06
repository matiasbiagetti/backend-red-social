import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, refreshTokens } from '../controllers/authController';
import authMiddleware from '../middlewares/authMiddleware';

const router: Router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', authMiddleware, resetPassword); 
router.post('/refresh', refreshTokens);


export default router;
