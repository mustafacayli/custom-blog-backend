// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Express'in Request objesine 'user' özelliğini eklemek için Type genişletmesi yapıyoruz
export interface AuthRequest extends Request {
    user?: { userId: string };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    // İstemciden gelen token'ı al (Genelde "Bearer <token_id>" şeklinde gelir)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Erişim reddedildi. Token bulunamadı.' });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET || 'gizli_anahtar_yedek';
        // Token geçerli mi diye kontrol et ve içindeki veriyi (userId) çöz
        const decoded = jwt.verify(token, jwtSecret) as { userId: string };
        
        // Çözülen veriyi req.user içine koy ki Controller'da kullanabilelim
        req.user = decoded;
        
        // Her şey yolundaysa bir sonraki adıma (Controller'a) geç
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Geçersiz veya süresi dolmuş token.' });
    }
};