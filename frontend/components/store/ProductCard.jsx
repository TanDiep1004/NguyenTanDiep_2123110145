'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getToken } from '@/lib/auth';

const SAFE_EYEWEAR_PHOTOS = [
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800',
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800',
  'https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=800',
  'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=800',
  'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=800',
  'https://images.unsplash.com/photo-1509695507497-903c140c43b0?q=80&w=800',
  'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=800'
];

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const brandName = product.brand?.name || 'Ray-Ban';
  const defaultIdx = (Number(product.id) || 1) % SAFE_EYEWEAR_PHOTOS.length;
  const safeFallback = SAFE_EYEWEAR_PHOTOS[defaultIdx];

  const rawImage =
    product.images && product.images.length > 0 && product.images[0].imageUrl
      ? product.images[0].imageUrl
      : product.imageUrl;

  const [imgSrc, setImgSrc] = useState(rawImage || safeFallback);

  useEffect(() => {
    const valid = rawImage && !rawImage.includes('wikimedia.org');
    setImgSrc(valid ? rawImage : safeFallback);
  }, [rawImage, safeFallback]);

  const price = product.price || 1500000;
  const originalPrice = product.originalPrice && product.originalPrice > price ? product.originalPrice : null;
  const discountPercent =
    product.discountPercent ||
    (originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = getToken();
    if (!token) {
      alert('VUI LÒNG ĐĂNG NHẬP!\nBạn cần đăng nhập tài khoản trước khi thêm sản phẩm vào giỏ hàng.');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return;
    }

    const added = addToCart(product, null, 1);
    if (added) {
      alert(`Đã thêm "${product.name}" vào giỏ hàng thành công!`);
    }
  };

  return (
    <div className="group bg-slate-900 border border-slate-800/90 rounded-2xl overflow-hidden shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between">
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-slate-950">
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgSrc(safeFallback)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Sale badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase shadow">
            -{discountPercent}% OFF
          </span>
        )}
        {/* Brand tag */}
        <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur text-emerald-400 font-bold text-[10px] px-2.5 py-1 rounded-full border border-emerald-500/30">
          {brandName}
        </span>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-amber-400 mb-1.5 text-[11px]">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-slate-400 font-semibold ml-1">(4.9)</span>
          </div>

          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-white text-sm line-clamp-2 hover:text-emerald-400 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-base font-black text-emerald-400">
              {Number(price).toLocaleString('vi-VN')} VNĐ
            </div>
            {originalPrice && (
              <div className="text-[11px] text-slate-500 line-through font-medium">
                {Number(originalPrice).toLocaleString('vi-VN')} VNĐ
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/products/${product.id}`}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Xem chi tiết"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              onClick={handleQuickAdd}
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              title="Thêm nhanh giỏ hàng"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
