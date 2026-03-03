// src/repositories/post.repository.ts
import pool from '../config/db';
import type { Post } from '../types/post'; // <--- Buraya 'type' kelimesi eklendi

export class PostRepository {
    // 1. Yeni bir blog yazısı ekleme
    static async create(title: string, slug: string, content: string, authorId: string): Promise<Post> {
        const query = `
            INSERT INTO posts (title, slug, content, author_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const result = await pool.query(query, [title, slug, content, authorId]);
        return result.rows[0];
    }

    // 2. Sadece yayında olan (taslak olmayan) yazıları getirme (Ziyaretçiler siteye girdiğinde çalışacak)
    static async findAllPublished(): Promise<Post[]> {
        const query = 'SELECT * FROM posts WHERE is_published = true ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    }

    // 3. Tek bir yazıyı URL uzantısına (slug) göre getirme
    static async findBySlug(slug: string): Promise<Post | null> {
        const result = await pool.query('SELECT * FROM posts WHERE slug = $1 AND is_published = true', [slug]);
        return result.rows[0] || null;
    }


    // 4. Yazıyı Güncelle
    static async update(id: string, title: string, slug: string, content: string, is_published: boolean): Promise<Post | null> {
        const query = `
            UPDATE posts 
            SET title = $1, slug = $2, content = $3, is_published = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *;
        `;
        const result = await pool.query(query, [title, slug, content, is_published, id]);
        return result.rows[0] || null;
    }

    // 5. Yazıyı Sil
    static async delete(id: string): Promise<boolean> {
        const result = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
        // Eğer silinen satır sayısı (rowCount) 0'dan büyükse true dön (yani başarıyla silindi)
        return (result.rowCount ?? 0) > 0;
    }
}