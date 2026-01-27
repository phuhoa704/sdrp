import { NewsArticle } from "@/types/news";

export const MOCK_NEWS: NewsArticle[] = [
    {
        id: "n1",
        title: "Giá lúa gạo xuất khẩu đạt đỉnh mới trong quý 2/2024",
        category: "Thị trường",
        author: "VnExpress Agribiz",
        date: "6 giờ trước",
        image: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&q=80&w=800",
        summary: "Thị trường thế giới đang khan hiếm nguồn cung, tạo cơ hội lớn cho các đại lý thu mua tại ĐBSCL...",
        isBreaking: true
    },
    {
        id: "n2",
        title: "Kỹ thuật canh tác lúa hữu cơ giảm 30% chi phí phân bón",
        category: "Kỹ thuật",
        author: "Viện Cây Ăn Quả",
        date: "27/02/2024",
        image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800",
        summary: "Ứng dụng công nghệ vi sinh vào canh tác giúp đất tơi xốp và hạn chế sâu bệnh tự nhiên..."
    }
];