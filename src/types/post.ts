// src/types/post.ts

export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    is_published: boolean;
    author_id: string;
    created_at: Date;
    updated_at: Date;
}