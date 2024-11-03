import { Router } from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/authController';

const router: Router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword); 


export default router;
