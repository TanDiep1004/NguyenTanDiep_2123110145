'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Star, ShoppingBag, CreditCard, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { productService } from '@/services/productService';

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadProductDetail() {
      // 1. Fetch from backend API
      try {
        const res = await productService.getProductById(productId);
        if (res.data) {
          const raw = res.data;
          const baseProduct = raw.product || raw;
          const imagesList = raw.images || baseProduct.images || [];
          const variantsList = raw.variants || baseProduct.variants || [];

          const fullObj = {
            ...baseProduct,
            images: imagesList,
            variants: variantsList,
          };

          setProduct(fullObj);

          if (imagesList.length > 0) {
            setSelectedImage(imagesList[0].imageUrl);
          } else if (fullObj.imageUrl) {
            setSelectedImage(fullObj.imageUrl);
          }

          if (variantsList.length > 0) {
            if (variantsList[0].color) setSelectedColor(variantsList[0].color);
            if (variantsList[0].degree) setSelectedDegree(variantsList[0].degree);
          }

          setLoading(false);
          return;
        }
      } catch (e) {
        console.error("Fetch product detail error:", e);
      }

      // 2. Try stored_products in localStorage
      try {
        const storedProds = JSON.parse(localStorage.getItem('stored_products') || '[]');
        const found = storedProds.find(p => p.id.toString() === productId.toString());
        if (found) {
          setProduct(found);
          if (found.images && found.images.length > 0) {
            setSelectedImage(found.images[0].imageUrl);
          }
          if (found.variants && found.variants.length > 0) {
            if (found.variants[0].color) setSelectedColor(found.variants[0].color);
            if (found.variants[0].degree) setSelectedDegree(found.variants[0].degree);
          }
          setLoading(false);
          return;
        }
      } catch (e) {}

      // 3. Fallback demo product
      const fallback = {
        id: productId,
        name: 'Kính Râm Ray-Ban Aviator Classic RB3025 G-15',
        description: 'Mẫu kính râm huyền thoại Ray-Ban Aviator RB3025 gọng kim loại sang trọng, tròng kính G-15 chống 100% tia UV400 bảo vệ mắt tuyệt đối.',
        content: 'Chất liệu gọng: Titanium mạ vàng, Kích thước: 58-14-135, Xuất xứ: Ý',
        price: 3250000,
        originalPrice: 4100000,
        brand: { name: 'Ray-Ban' },
        category: { name: 'Kính Râm' },
        images: [
          { imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800', isPrimary: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800', isPrimary: 0 },
        ],
        variants: [
          { id: 101, color: 'Đen Nhám', degree: '0.00 (Không độ)', price: 3250000, stockQuantity: 50 },
          { id: 102, color: 'Vàng Kim', degree: '0.00 (Không độ)', price: 3550000, stockQuantity: 30 },
          { id: 103, color: 'Đen Nhám', degree: '1.50 độ', price: 3450000, stockQuantity: 15 },
        ]
      };
      setProduct(fallback);
      setSelectedImage(fallback.images[0].imageUrl);
      setSelectedColor(fallback.variants[0].color);
      setSelectedDegree(fallback.variants[0].degree);
      setLoading(false);
    }
    loadProductDetail();
  }, [productId]);

  if (loading || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Đang tải thông tin chi tiết kính...</span>
        </div>
      </div>
    );
  }

  // Danh sách màu sắc thực tế từ biến thể sản phẩm
  const colorOptions = Array.from(
    new Set(
      product.variants && product.variants.length > 0
        ? product.variants.map((v) => v.color).filter(Boolean)
        : ['Đen Nhám', 'Vàng Kim', 'Bạc Sang Trọng']
    )
  );

  // Danh sách độ cận thực tế từ biến thể sản phẩm
  const degreeOptions = Array.from(
    new Set(
      product.variants && product.variants.length > 0
        ? product.variants.map((v) => v.degree).filter(Boolean)
        : ['0.00 (Không độ)', '1.50 độ', '2.00 độ', '3.00 độ']
    )
  );

  const activeColor = selectedColor || colorOptions[0] || 'Đen Nhám';
  const activeDegree = selectedDegree || degreeOptions[0] || '0.00 (Không độ)';

  // Tìm biến thể khớp với màu sắc và độ cận đang chọn
  const matchedVariant = product.variants?.find(
    (v) => (v.color || colorOptions[0]) === activeColor && (v.degree || degreeOptions[0]) === activeDegree
  );

  // Đơn giá thay đổi realtime theo biến thể chọn
  const displayPrice = matchedVariant?.price ? Number(matchedVariant.price) : (product.price ? Number(product.price) : 1500000);
  const originalPrice = product.originalPrice && product.originalPrice > displayPrice ? Number(product.originalPrice) : null;
  const discountPercent = originalPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;
  
  const stockQuantity = matchedVariant?.stockQuantity ?? 50;

  const handleAddToCart = () => {
    const added = addToCart(product, matchedVariant || { color: activeColor, degree: activeDegree, price: displayPrice }, quantity);
    if (added) {
      alert(`Đã thêm ${quantity}x "${product.name}" (${activeColor}, ${activeDegree}) vào giỏ hàng với giá ${displayPrice.toLocaleString('vi-VN')} VNĐ!`);
    }
  };

  const handleBuyNow = () => {
    const added = addToCart(product, matchedVariant || { color: activeColor, degree: activeDegree, price: displayPrice }, quantity);
    if (added) {
      router.push('/checkout');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-12">
      <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách sản phẩm
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Image Gallery */}
        <div className="space-y-4 sticky top-24">
          <div className="aspect-square bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            <img src={selectedImage || product.imageUrl || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800'} alt={product.name} className="w-full h-full object-cover" />
            <span className="absolute top-4 left-4 bg-emerald-500 text-slate-950 font-extrabold text-xs px-3 py-1 rounded-full uppercase">
              Chính hãng 100%
            </span>
          </div>

          {/* Thumbnails list */}
          {product.images && product.images.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImage === img.imageUrl ? 'border-emerald-500 scale-105 shadow-lg shadow-emerald-500/20' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.imageUrl} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Product Information */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                {product.brand?.name || 'Ray-Ban'}
              </span>
              <span className="text-xs text-slate-400 font-medium">Mã SKU: MK-{product.id}</span>
            </div>
            <h1 className="text-3xl font-black text-white leading-tight">{product.name}</h1>
            <div className="flex items-center gap-2 text-amber-400 text-xs">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-slate-300 font-bold">4.9/5.0</span>
              <span className="text-slate-500">• (128 Đánh giá từ khách hàng)</span>
            </div>
          </div>

          {/* Price & Stock Display - Tự động thay đổi giá khi chọn màu sắc & độ cận khác */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black text-emerald-400">{displayPrice.toLocaleString('vi-VN')} VNĐ</span>
              {originalPrice && (
                <>
                  <span className="text-sm text-slate-500 line-through font-medium">
                    {originalPrice.toLocaleString('vi-VN')} VNĐ
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/30">
                    Tiết kiệm {discountPercent}%
                  </span>
                </>
              )}
            </div>
            <div className="text-xs font-bold flex items-center gap-2">
              <span className="text-slate-400">Trạng thái kho hàng:</span>
              {stockQuantity > 0 ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Còn hàng ({stockQuantity} chiếc)
                </span>
              ) : (
                <span className="text-rose-400">Hết hàng</span>
              )}
            </div>
          </div>

          {/* Selectors: Color */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase">Màu sắc gọng kính</label>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeColor === color
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-105'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Selectors: Degree */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase">Độ cận tròng kính</label>
            <div className="flex flex-wrap gap-3">
              {degreeOptions.map((deg) => (
                <button
                  key={deg}
                  onClick={() => setSelectedDegree(deg)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeDegree === deg
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-105'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {deg}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Counter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase">Số lượng mua</label>
            <div className="flex items-center gap-3 w-fit bg-slate-900 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <span className="w-10 text-center font-extrabold text-sm text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              className="py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-emerald-400 font-black text-sm border border-emerald-500/50 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>THÊM VÀO GIỎ HÀNG</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl shadow-emerald-500/25"
            >
              <CreditCard className="w-5 h-5" />
              <span>MUA NGAY (THANH TOÁN)</span>
            </button>
          </div>

          {/* Specs box */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase border-b border-slate-800 pb-2">Thông số kỹ thuật sản phẩm</h4>
            <p className="text-slate-300 leading-relaxed">{product.content || product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
