import { DiseaseDetail } from "@/types/disease";

export const MOCK_DISEASE_DATA: Record<string, DiseaseDetail & { wikiUrl?: string }> = {
    "vang-la": {
        id: "vang-la",
        name: "Vàng lá chín sớm (Physiological Yellowing)",
        wikiUrl: "https://vi.wikipedia.org/wiki/B%E1%BB%87nh_v%C3%A0ng_l%C3%A1_l%C3%BAa",
        description: "Bệnh vàng lá chín sớm thường xuất hiện trên lúa giai đoạn đòng trổ (45-60 ngày sau sạ). Bệnh do nấm Gondronia oryzae gây ra.",
        symptoms: [
            "Vết bệnh hình mũi mác, màu vàng cam trên phiến lá.",
            "Chóp lá bị khô cháy bìa, gân chính vẫn giữ màu xanh ban đầu."
        ],
        cause: "Tác nhân chính là nấm Gondronia oryzae.",
        recommendedIngredients: ["Azoxystrobin", "Difenoconazole", "Propineb"],
        stages: [
            { title: "Phòng ngừa", action: "Sạ thưa, bón cân đối phân NPK.", severity: "low" },
            { title: "Điều trị", action: "Phun Azoxystrobin liều 200ml/ha.", severity: "high" }
        ]
    },
    "dao-on": {
        id: "dao-on",
        name: "Đạo ôn lá (Pyricularia oryzae)",
        wikiUrl: "https://vi.wikipedia.org/wiki/B%E1%BB%87nh_%C4%91%E1%BA%A1o_%C3%B4n_l%C3%BAa",
        description: "Bệnh do nấm Pyricularia oryzae gây ra, xuất hiện ở mọi giai đoạn của cây lúa.",
        symptoms: [
            "Vết bệnh hình mắt én, tâm xám trắng, mép nâu đỏ.",
            "Vết bệnh lan rộng gây cháy lá hoàn toàn."
        ],
        cause: "Nấm Pyricularia oryzae phát triển mạnh khi trời mát, sương mù nhiều.",
        recommendedIngredients: ["Tricyclazole", "Isoprothiolane", "Difenoconazole"],
        stages: [
            { title: "Phòng ngừa", action: "Không bón thừa đạm.", severity: "low" },
            { title: "Điều trị", action: "Phun Tricyclazole ngay khi thấy vết bệnh mắt én.", severity: "high" }
        ]
    }
};