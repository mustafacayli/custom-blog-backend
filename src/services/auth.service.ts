// src/services/auth.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import type { User } from '../types/user';

export class AuthService {
    // 1. Yeni Kullanıcı Kaydı (Register)
    static async register(email: string, password: string): Promise<User> {
        // Önce bu email sistemde var mı diye kontrol et
        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Bu email adresi zaten kullanımda.');
        }

        // Şifreyi kriptola (10 değeri güvenlik seviyesidir, ne kadar yüksekse o kadar zor kırılır ama yavaşlar)
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Kriptolanmış şifreyle kullanıcıyı veritabanına kaydet
        const newUser = await UserRepository.create(email, passwordHash);
        return newUser;
    }

    // 2. Kullanıcı Girişi (Login)
    static async login(email: string, password: string): Promise<{ user: User, token: string }> {
    console.log("--- LOGIN DENEMESİ BAŞLADI ---");
    console.log("1. Frontend'den Gelen Email:", email);
    console.log("2. Frontend'den Gelen Şifre Uzunluğu:", password?.length);

    const user = await UserRepository.findByEmail(email);
    
    if (!user) {
        console.log("HATA: Bu email ile kullanıcı bulunamadı.");
        throw new Error('Kullanıcı bulunamadı.');
    }

    console.log("3. DB'den Bulunan Kullanıcı:", user.email);
    console.log("4. DB'deki Şifre Hash'i:", user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("5. Şifre Eşleşme Sonucu:", isPasswordValid);

    if (!isPasswordValid) throw new Error('Hatalı şifre.');

    const jwtSecret = process.env.JWT_SECRET || 'gizli_anahtar_yedek';
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '24h' });

    return { user, token };
}
}