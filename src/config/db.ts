import { Pool } from 'pg';
import dotenv from 'dotenv';

// Çevresel değişkenleri yükle (ileride oluşturacağımız .env dosyasından okuyacak)
dotenv.config();

// PostgreSQL bağlantı havuzunu (Pool) oluştur
// Tekil bağlantı yerine Pool kullanmak, gelen istekleri sıraya sokarak performansı ciddi oranda artırır.
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'custom_blog_db',
  password: process.env.DB_PASSWORD || 'sifreniburayayaz',
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

// Bağlantıyı test etmek için bir olay dinleyici (event listener)
pool.on('connect', () => {
  console.log('PostgreSQL veritabanına başarıyla bağlanıldı.');
});

pool.on('error', (err) => {
  console.error('Veritabanı bağlantısında kritik hata:', err);
  process.exit(-1);
});

export default pool;