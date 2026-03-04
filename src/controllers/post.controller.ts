// src/controllers/post.controller.ts
import { Response } from 'express';
import { PostService } from '../services/post.service';
import { AuthRequest } from '../middlewares/auth.middleware'; // Genişletilmiş Request tipimizi çağırdık

export class PostController {
    // 1. Yeni yazı ekleme (Artık GERÇEK kullanıcı ID'si ve Zırhlı Kontrol ile)
    static async create(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { title, content } = req.body;

            // --- YENİ EKLENEN ZIRH (Eksik veri kontrolü) ---
            if (!title || !content) {
                res.status(400).json({ error: 'Lütfen başlık (title) ve içerik (content) alanlarını eksiksiz gönderin.' });
                return;
            }
            // -----------------------------------------------
            
            const authorId = req.user?.userId;

            if (!authorId) {
                res.status(401).json({ message: 'Yetkilendirme hatası.' });
                return;
            }

            const newPost = await PostService.createPost(title, content, authorId);
            res.status(201).json({ message: 'Yazı başarıyla oluşturuldu', post: newPost });
        } catch (error: any) {
            // Hata olursa Render loglarında tam nedenini görelim
            console.error("🚨 YAZI EKLEME HATASI:", error);
            res.status(400).json({ error: error.message });
        }
    }

    // 2. Tüm yazıları listeleme (Herkese açık)
    static async getAll(req: AuthRequest, res: Response): Promise<void> {
        try {
            const posts = await PostService.getAllPublished();
            res.status(200).json(posts);
        } catch (error: any) {
            res.status(500).json({ error: 'Yazılar getirilirken bir hata oluştu.' });
        }
    }

    // 3. Tek bir yazıyı getirme (Herkese açık)
    static async getOne(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { slug } = req.params;
            
            // TypeScript'i rahatlatmak ve API güvenliğini artırmak için tip kontrolü
            if (!slug || typeof slug !== 'string') {
                res.status(400).json({ message: 'Geçersiz yazı bağlantısı (slug).' });
                return;
            }

            // Artık TypeScript 'slug' değişkeninin kesinlikle string olduğundan emin!
            const post = await PostService.getBySlug(slug);
            
            if (!post) {
                res.status(404).json({ message: 'Yazı bulunamadı.' });
                return;
            }
            res.status(200).json(post);
        } catch (error: any) {
            res.status(500).json({ error: 'Yazı getirilirken bir hata oluştu.' });
        }
    }

    // 4. Yazı Güncelleme İsteğini Karşıla
    static async update(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            // TypeScript'i rahatlatmak için tip kontrolü
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Geçersiz yazı kimliği (id).' });
                return;
            }

            const { title, content, is_published } = req.body;

            const updatedPost = await PostService.updatePost(id, title, content, is_published);
            
            if (!updatedPost) {
                res.status(404).json({ message: 'Güncellenecek yazı bulunamadı.' });
                return;
            }
            res.status(200).json({ message: 'Yazı güncellendi', post: updatedPost });
        } catch (error: any) {
            res.status(500).json({ error: 'Yazı güncellenirken hata oluştu.' });
        }
    }

    // 5. Yazı Silme İsteğini Karşıla
    static async delete(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            // TypeScript'i rahatlatmak için tip kontrolü
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Geçersiz yazı kimliği (id).' });
                return;
            }

            const isDeleted = await PostService.deletePost(id);
            
            if (!isDeleted) {
                res.status(404).json({ message: 'Silinecek yazı bulunamadı.' });
                return;
            }
            res.status(200).json({ message: 'Yazı başarıyla silindi.' });
        } catch (error: any) {
            res.status(500).json({ error: 'Yazı silinirken hata oluştu.' });
        }
    }
}