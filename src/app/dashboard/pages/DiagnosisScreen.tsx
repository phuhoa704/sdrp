
import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, AlertTriangle, Info, Microscope, Syringe, ChevronRight } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Product } from '@/types/product';
import { ProductRow } from '@/components/product/ProductRow';
import { MOCK_PRODUCTS } from '../../../../mocks/product';

interface DiagnosisScreenProps {
  onBack: () => void;
  onAddToCart: (p: Product, v: any) => void;
  onProductClick: (p: Product) => void;
}

export const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({ onBack, onAddToCart, onProductClick }) => {
  const [image, setImage] = useState<string | null>(null);
  const [symptom, setSymptom] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDiagnose = async () => {
    if (!symptom && !image) return;
    setLoading(true);

    // Simulate AI Processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setAiResult({
      disease: "Bệnh Đạo Ôn Lá (Pyricularia oryzae)",
      confidence: 0.94,
      cause: "Do nấm Pyricularia oryzae gây ra, phát triển mạnh trong điều kiện ẩm độ cao, sương mù nhiều và bón thừa phân đạm.",
      suggestedPrescription: [
        { productId: "p1", totalQuantity: 2 },
        { productId: "p3", totalQuantity: 1 }
      ]
    });
    setLoading(false);
  };

  return (
    <div className="pb-10 animate-fade-in space-y-6">
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => { setAiResult(null); onBack(); }}>CHẨN ĐOÁN AI</span>
        {aiResult && (
          <>
            <ChevronRight size={10} />
            <span className="text-primary">Kết quả phân tích</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white dark:bg-slate-900 dark:text-white rounded-xl shadow-sm"><ArrowLeft size={20} /></button>
        <h2 className="text-2xl font-bold text-[#111827] dark:text-white">Chẩn đoán AI</h2>
      </div>

      {!aiResult ? (
        <div className="space-y-6">
          <div onClick={() => fileInputRef.current?.click()} className={`relative border-2 border-dashed rounded-[32px] h-80 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${image ? 'border-primary bg-green-50 dark:bg-green-900/10' : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary'}`}>
            {image ? <img src={image} className="h-full w-full object-cover" alt="Preview" /> : <div className="text-center p-6"><div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4"><Camera size={32} /></div><p className="text-sm font-bold text-[#111827] dark:text-slate-300">Chụp ảnh triệu chứng</p></div>}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setImage(reader.result as string); reader.readAsDataURL(file); } }} />
          </div>
          <textarea
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder="VD: Lúa bị vàng lá, diện tích 2ha..."
            className="h-32 w-full p-5 rounded-[24px] bg-white dark:bg-slate-900 dark:text-white border-none outline-none text-sm shadow-sm focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40 transition-colors"
          />
          <Button fullWidth size="lg" onClick={handleDiagnose} disabled={loading || (!image && !symptom)}>{loading ? "Đang phân tích..." : "Bắt đầu chẩn đoán"}</Button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <Card className="border-none bg-white dark:bg-slate-900 overflow-hidden p-0 shadow-lg">
            <div className="bg-[#111827] dark:bg-slate-950 p-6 text-white transition-colors">
              <div className="flex justify-between items-start">
                <div><p className="text-[10px] font-bold text-primary uppercase mb-1">Kết quả</p><h3 className="text-2xl font-bold">{aiResult.disease}</h3></div>
                <div className="bg-primary px-3 py-1.5 rounded-full text-xs">Tin cậy {Math.round(aiResult.confidence * 100)}%</div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2 flex items-center gap-2"><Info size={14} /> Nguyên nhân</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 bg-[#F9FAF9] dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">{aiResult.cause}</p>
              </div>
              {aiResult.suggestedPrescription && (
                <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                  <h4 className="text-[10px] font-bold text-primary uppercase mb-4 flex items-center gap-2"><Syringe size={14} /> Kê đơn tham khảo</h4>
                  <div className="space-y-3">
                    {aiResult.suggestedPrescription.map((item: any, idx: number) => {
                      const product = MOCK_PRODUCTS.find((p: Product) => p.id === item.productId);
                      return product ? (
                        <ProductRow
                          key={idx}
                          product={product}
                          showDosage
                          onClick={() => onProductClick(product)}
                          onAddToCart={() => onAddToCart(product, { quantity: item.totalQuantity })}
                          showAction
                        />
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </Card>
          <Button fullWidth size="lg" onClick={() => setAiResult(null)}>Phân tích mới</Button>
        </div>
      )}
    </div>
  );
};
