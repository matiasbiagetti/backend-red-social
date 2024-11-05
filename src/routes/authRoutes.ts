import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, refreshToken } from '../controllers/authController';
import authMiddleware from '../middlewares/authMiddleware';

const router: Router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', authMiddleware, resetPassword); 
router.post('/refresh', refreshToken);


export default router;
