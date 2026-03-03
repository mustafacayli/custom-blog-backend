// src/types/user.ts

export interface User {
    id: string;
    username: string;
    email: string;
    password_hash: string;
    created_at: Date;
}