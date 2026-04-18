import express from 'express';
import dotenv from 'dotenv';
import pool from './config/db';
import authRoutes from './routes/auth.routes';
import postRoutes from './routes/post.routes';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Auth (Kimlik Doğrulama) rotalarını sisteme tanıtıyoruz
app.use('/api/auth', authRoutes);

// Yazı (Post) rotalarını sisteme tanıtıyoruz
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
    res.send('Blog API tıkır tıkır çalışıyor!');
});

// Render ve Neon.tech uyku modunu engelleme rotası
app.get('/keep-alive', async (req, res) => {
    try {
        // Neon.tech veritabanını uyanık tutmak için basit bir sorgu atıyoruz
        await pool.query('SELECT 1'); 
        res.status(200).send('Sistem ve veritabanı uyanık!');
    } catch (error) {
        console.error('Keep-alive hatası:', error);
        res.status(500).send('Veritabanı bağlantı hatası');
    }
});

app.listen(PORT, async () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde ayaklandı.`);
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('Veritabanı zamanı:', result.rows[0].now);
    } catch (error) {
        console.error('Veritabanına bağlanılamadı!', error);
    }
});