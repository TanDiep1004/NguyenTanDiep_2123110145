'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Eye, Share2 } from 'lucide-react';
import { articleService } from '@/services/articleService';

export default function ArticleDetailPage({ params }) {
  const resolvedParams = use(params);
  const articleId = resolvedParams.id;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      try {
        setLoading(true);
        const res = await articleService.getArticleByIdPublic(articleId);
        if (res.data) setArticle(res.data);
      } catch (err) {
        console.error('Lỗi tải bài viết:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [articleId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold">Đang tải nội dung bài viết...</span>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-white">Không tìm thấy bài viết</h2>
        <Link href="/articles" className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách bài viết
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <Link href="/articles" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Tất cả bài viết tin tức
      </Link>

      <article className="space-y-6">
        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-6 text-xs text-slate-400 border-y border-slate-800 py-3">
          <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-emerald-400" /> Tác giả: Ban Biên Tập NTD</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-emerald-400" /> Ngày đăng: Mới cập nhật</span>
        </div>

        <div className="h-96 w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
          <img
            src={article.thumbnail || 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800'}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed space-y-4 pt-4">
          <p className="whitespace-pre-line">{article.content}</p>
        </div>
      </article>
    </div>
  );
}
