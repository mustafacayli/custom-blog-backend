// src/services/post.service.ts
import slugify from 'slugify';
import { PostRepository } from '../repositories/post.repository';
import type { Post } from '../types/post';

export class PostService {
    // 1. Yeni Yazı Oluştur
    static async createPost(title: string, content: string, authorId: string): Promise<Post> {
        // Başlıktan otomatik ve temiz bir URL uzantısı (slug) üret
        const slug = slugify(title, {
            lower: true,      // Hepsini küçük harf yap
            strict: true,     // Özel karakterleri (?! vb.) temizle
            trim: true        // Başındaki sonundaki boşlukları at
        });

        // Üretilen slug ile yazıyı veritabanına kaydetmesi için Repository'e gönder
        return await PostRepository.create(title, slug, content, authorId);
    }

    // 2. Yayındaki Tüm Yazıları Getir
    static async getAllPublished(): Promise<Post[]> {
        return await PostRepository.findAllPublished();
    }

    // 3. Tekil Yazı Getir
    static async getBySlug(slug: string): Promise<Post | null> {
        return await PostRepository.findBySlug(slug);
    }
    
    // 4. Yazıyı Güncelleme Servisi
    static async updatePost(id: string, title: string, content: string, is_published: boolean): Promise<Post | null> {
        const newSlug = slugify(title, { lower: true, strict: true, trim: true });
        return await PostRepository.update(id, title, newSlug, content, is_published);
    }

    // 5. Yazı Silme Servisi
    static async deletePost(id: string): Promise<boolean> {
        return await PostRepository.delete(id);
    }
}