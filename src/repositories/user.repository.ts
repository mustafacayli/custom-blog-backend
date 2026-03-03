// src/repositories/user.repository.ts
import pool from '../config/db';
import type { User } from '../types/user'; // <--- Buraya 'type' kelimesi eklendi

export class UserRepository {
    // 1. Email adresine göre kullanıcı bulma (Sisteme giriş yaparken kullanacağız)
    static async findByEmail(email: string): Promise<User | null> {
        // $1 kullanımı bizi SQL Injection (Veritabanı hackleme) saldırılarından korur
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0] || null;
    }

    // 2. Yeni kullanıcı oluşturma (Kendi admin hesabımızı kurarken kullanacağız)
    static async create(username: string, email: string, passwordHash: string): Promise<User> {
        const query = `
            INSERT INTO users (username, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const result = await pool.query(query, [username, email, passwordHash]);
        return result.rows[0];
    }
}