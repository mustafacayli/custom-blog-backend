// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    // 1. Kayıt İsteklerini Karşıla
    static async register(req: Request, res: Response) {
        try {
            // İstemciden (örneğin mobil uygulamadan) gelen verileri al
            const {email, password } = req.body;
            
            // Verileri işin beynine (Servise) gönder
            const user = await AuthService.register(email, password);
            
            // Başarılı olursa 201 (Oluşturuldu) koduyla yanıt dön
            res.status(201).json({
                message: 'Kullanıcı başarıyla oluşturuldu',
                user: { id: user.id, email: user.email } // Şifreyi asla geri dönmüyoruz!
            });
        } catch (error: any) {
            // Hata olursa 400 (Kötü İstek) koduyla hatayı fırlat
            res.status(400).json({ error: error.message });
        }
    }

    // 2. Giriş İsteklerini Karşıla
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            
            // Servisten kullanıcıyı ve dijital anahtarı (token) al
            const { user, token } = await AuthService.login(email, password);
            
            // Başarılı giriş yanıtı (Token'ı istemciye veriyoruz ki sonraki isteklerde kullansın)
            res.status(200).json({
                message: 'Giriş başarılı',
                token,
                user: { id: user.id, email: user.email }
            });
        } catch (error: any) {
            res.status(401).json({ error: error.message }); // 401: Yetkisiz
        }
    }
}