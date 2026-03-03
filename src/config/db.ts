import { Pool } from 'pg';
import dotenv from 'dotenv';

// Çevresel değişkenleri yükle
dotenv.config();

/**
 * Modern Bulut Uyumluluğu:
 * Artık host, user, password gibi parçalı değişkenler yerine
 * doğrudan tek parça olan DATABASE_URL (Connection String) kullanıyoruz.
 * Bu yöntem Render ve Neon.tech arasındaki en güvenli ve hızlı yoldur.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Bağlantı başarıyla kurulduğunda tetiklenir
pool.on('connect', () => {
  console.log('PostgreSQL (Neon.tech) veritabanına başarıyla bağlanıldı.');
});

// Bağlantı sırasında bir hata oluşursa tetiklenir
pool.on('error', (err) => {
  console.error('Veritabanı bağlantısında kritik hata:', err);
});

export default pool;