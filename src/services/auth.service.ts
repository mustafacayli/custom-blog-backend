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
        // Kullanıcıyı bul
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new Error('Kullanıcı bulunamadı.');
        }

        // Girilen şifre ile veritabanındaki kriptolu şifre eşleşiyor mu kontrol et
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Hatalı şifre.');
        }

        // Her şey doğruysa, JWT (JSON Web Token) dijital anahtarını oluştur
        const jwtSecret = process.env.JWT_SECRET || 'gizli_anahtar_yedek';
        // Token'ın içine kullanıcının ID'sini gömüyoruz ve 24 saat geçerli kılıyoruz
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '24h' });

        return { user, token };
    }
}