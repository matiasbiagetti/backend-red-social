import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, refreshTokens, logout, changePassword } from '../controllers/authController';
import authMiddleware from '../middlewares/authMiddleware';

const router: Router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword); 
router.post('/refresh', refreshTokens);
router.post('/logout', logout);
router.post('/change-password', authMiddleware, changePassword);



export default router;
