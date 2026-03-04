// src/repositories/user.repository.ts
import pool from '../config/db';
import type { User } from '../types/user';

export class UserRepository {
    // 1. Email adresine göre kullanıcı bulma
    static async findByEmail(email: string): Promise<User | null> {
        // SELECT * diyerek tüm sütunları (id, email, password vb.) güvenle çekiyoruz
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0] || null;
    }

    // 2. Yeni kullanıcı oluşturma
    static async create(email: string, passwordHash: string): Promise<User> {
        // DÜZELTME: password_hash yerine password kullandık ve $3 parametresini sildik
        const query = `
            INSERT INTO users (email, password)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const result = await pool.query(query, [email, passwordHash]);
        return result.rows[0];
    }
}