// src/routes/post.routes.ts
import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { authenticateToken } from '../middlewares/auth.middleware'; // Güvenlik görevlimiz geldi

const router = Router();

// Ziyaretçiye Açık Rotalar (Okuma işlemleri)
router.get('/', PostController.getAll);
router.get('/:slug', PostController.getOne);

// Korumalı Rota (Yazma işlemi) - Araya güvenlik görevlisini koyduk!
// Sadece elinde geçerli bir token olanlar PostController.create'e ulaşabilir.
router.post('/', authenticateToken, PostController.create);

// Bu işlemleri sadece giriş yapmış (token sahibi) kişiler yapabilir!
router.put('/:id', authenticateToken, PostController.update);
router.delete('/:id', authenticateToken, PostController.delete);

export default router;