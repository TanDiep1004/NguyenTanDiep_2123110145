'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { articleService } from '@/services/articleService';

export default function PublicArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);
        const res = await articleService.getAllArticlesPublic();
        if (res.data) setArticles(res.data);
      } catch (err) {
        console.error('Lỗi tải bài viết:', err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <FileText className="w-7 h-7 text-emerald-400" />
            <span>Tin Tức & Kinh Nghiệm Mắt Kính</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tổng hợp thông tin hữu ích về chăm sóc mắt, chọn gọng kính và xu hướng kính râm
          </p>
        </div>
        <Link href="/" className="text-xs font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
        </Link>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold">Đang tải bài viết...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <Link
              key={art.id}
              href={`/articles/${art.id}`}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-xl space-y-4 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="h-52 bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                  <img
                    src={art.thumbnail || 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800'}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="font-bold text-white text-lg line-clamp-2 group-hover:text-emerald-400 transition-colors">
                    {art.title}
                  </h2>
                  <p className="text-xs text-slate-400 line-clamp-4 leading-relaxed">
                    {art.content}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span>Đọc bài viết chi tiết</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
