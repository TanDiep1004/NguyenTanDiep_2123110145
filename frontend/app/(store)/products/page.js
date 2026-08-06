'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Glasses, Filter, Search, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';
import { productService } from '@/services/productService';

function ProductsContent() {
  const searchParams = useSearchParams();
  const brandIdParam = searchParams.get('brandId');
  const initialSearch = searchParams.get('search');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');

  useEffect(() => {
    if (initialSearch !== null) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [priceFilter, setPriceFilter] = useState('ALL');

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      let list = [];
      try {
        const res = await productService.getAllProductsPublic();
        if (res.data) {
          list = res.data.content || res.data;
        }
      } catch (e) {
        console.error('Lỗi API lấy sản phẩm:', e);
      }

      // Clear temporary test products from localStorage
      try {
        localStorage.removeItem('stored_products');
      } catch (e) {}

      // Deduplicate products by unique ID
      const uniqueProds = [];
      const seenIds = new Set();
      for (const p of list) {
        if (p && p.id && !seenIds.has(p.id.toString())) {
          seenIds.add(p.id.toString());
          uniqueProds.push(p);
        }
      }

      setProducts(uniqueProds);
      setLoading(false);
    }
    loadProducts();
  }, []);

  const filtered = products.filter((p) => {
    // 1. Search Query
    if (searchQuery && !p.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // 2. Category
    if (selectedCategory !== 'ALL' && p.category?.name !== selectedCategory) {
      return false;
    }
    // 3. Brand
    if (selectedBrand !== 'ALL' && p.brand?.name !== selectedBrand) {
      return false;
    }
    // 4. Price
    const price = p.price || 1500000;
    if (priceFilter === 'UNDER_2M' && price >= 2000000) return false;
    if (priceFilter === '2M_4M' && (price < 2000000 || price > 4000000)) return false;
    if (priceFilter === 'ABOVE_4M' && price <= 4000000) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Glasses className="w-8 h-8 text-emerald-400" />
            <span>Bộ Sưu Tập Mắt Kính Cao Cấp</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Khám phá các thiết kế gọng kính cận, kính râm nam nữ chính hãng
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Tìm kiếm mắt kính..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      {/* Main Grid: Sidebar Filter & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filter */}
        <aside className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit space-y-6">
          <div className="flex items-center gap-2 font-bold text-white text-sm pb-3 border-b border-slate-800">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span>Bộ Lọc Sản Phẩm</span>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase">Danh mục</label>
            <div className="space-y-1">
              {['ALL', 'Gọng Kính Nam', 'Gọng Kính Nữ', 'Kính Râm Thời Trang'].map((cat, idx) => (
                <button
                  key={`cat-${idx}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                    selectedCategory === cat ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {cat === 'ALL' ? 'Tất cả danh mục' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-300 uppercase">Khoảng giá</label>
            <div className="space-y-1 text-xs text-slate-400">
              {[
                { id: 'ALL', label: 'Tất cả mức giá' },
                { id: 'UNDER_2M', label: 'Dưới 2.000.000 VNĐ' },
                { id: '2M_4M', label: 'Từ 2.000.000 - 4.000.000 VNĐ' },
                { id: 'ABOVE_4M', label: 'Trên 4.000.000 VNĐ' },
              ].map((p, idx) => (
                <button
                  key={`price-${p.id}-${idx}`}
                  onClick={() => setPriceFilter(p.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl font-medium cursor-pointer ${
                    priceFilter === p.id ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' : 'hover:bg-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-300 uppercase">Thương hiệu</label>
            <div className="space-y-1">
              {['ALL', 'Ray-Ban', 'Gucci', 'Gentle Monster', 'Oakley'].map((b, idx) => (
                <button
                  key={`brand-${b}-${idx}`}
                  onClick={() => setSelectedBrand(b)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                    selectedBrand === b ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {b === 'ALL' ? 'Tất cả thương hiệu' : b}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Hiển thị <b className="text-emerald-400">{filtered.length}</b> mẫu mắt kính</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((product, idx) => (
              <ProductCard key={product.id ? `prod-${product.id}-${idx}` : idx} product={product} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
              Không tìm thấy mẫu kính nào phù hợp với bộ lọc đã chọn.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsListingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center text-slate-400">
        <span>Đang tải bộ sưu tập kính...</span>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
