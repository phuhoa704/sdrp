export interface NewsArticle {
    id: string;
    title: string;
    category: string;
    author: string;
    date: string;
    image: string;
    summary: string;
    isBreaking?: boolean;
}