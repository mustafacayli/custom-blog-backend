// src/types/user.ts

export interface User {
    id: string;
    email: string;
    password: string; // password_hash değil, veritabanındaki adıyla aynı olmalı
    created_at: Date;
}