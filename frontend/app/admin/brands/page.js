'use client';

import { useState, useEffect } from 'react';
import { Award, Plus, Edit2, Trash2, X, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { brandService } from '@/services/brandService';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo: '',
    description: '',
    sortOrder: 0,
    status: 1,
  });

  const loadBrands = async () => {
    try {
      setLoading(true);
      const res = await brandService.getAllBrandsAdmin();
      if (res.data) {
        setBrands(res.data);
      }
    } catch (err) {
      console.error('Lỗi tải Thương hiệu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          logo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddModal = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      slug: '',
      logo: '',
      description: '',
      sortOrder: brands.length + 1,
      status: 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name || '',
      slug: brand.slug || '',
      logo: brand.logo || '',
      description: brand.description || '',
      sortOrder: brand.sortOrder ?? 0,
      status: brand.status ?? 1,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Vui lòng nhập tên thương hiệu!');
      return;
    }

    try {
      if (editingBrand) {
        await brandService.updateBrand(editingBrand.id, formData);
        alert('Cập nhật Thương hiệu thành công!');
      } else {
        await brandService.createBrand(formData);
        alert('Thêm Thương hiệu mới thành công!');
      }
      setIsModalOpen(false);
      loadBrands();
    } catch (err) {
      alert('Lỗi: ' + (err.message || 'Không thể lưu Thương hiệu'));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa Thương hiệu này khỏi CSDL không?')) return;
    try {
      await brandService.deleteBrand(id);
      alert('Xóa Thương hiệu thành công!');
      loadBrands();
    } catch (err) {
      alert('Lỗi khi xóa: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-400" />
            <span>Quản lý Thương Hiệu Mắt Kính (Bảng brands)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Hãng kính nổi tiếng Ray-Ban, Gucci, Gentle Monster, Oakley, Prada</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm thương hiệu mới</span>
        </button>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold">Đang tải dữ liệu Thương hiệu từ MySQL...</span>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Tên thương hiệu</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Logo thương hiệu</th>
                <th className="p-4">Thứ tự</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {brands.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-emerald-400">#{b.id}</td>
                  <td className="p-4 font-bold text-white text-sm flex items-center gap-3">
                    {b.logo ? (
                      <img src={b.logo} alt={b.name} className="w-8 h-8 object-contain rounded-lg bg-white p-0.5 border border-slate-800" />
                    ) : (
                      <Award className="w-6 h-6 text-slate-500" />
                    )}
                    <span>{b.name}</span>
                  </td>
                  <td className="p-4 font-mono text-slate-400">{b.slug}</td>
                  <td className="p-4 text-slate-400">
                    {b.logo ? <span className="text-emerald-400 font-semibold">✓ Đã tải logo</span> : <span className="text-slate-500">Chưa có logo</span>}
                  </td>
                  <td className="p-4 font-semibold text-amber-400">#{b.sortOrder}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      b.status === 1 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {b.status === 1 ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(b)}
                      className="p-2 text-slate-400 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer transition-all"
                      title="Sửa thương hiệu"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer transition-all"
                      title="Xóa thương hiệu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form Thêm / Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>{editingBrand ? 'Cập Nhật Thương Hiệu #' + editingBrand.id : 'Thêm Thương Hiệu Mới'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Tên thương hiệu *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ray-Ban"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Slug đường dẫn</label>
                <input
                  type="text"
                  placeholder="ray-ban"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Upload Logo from Computer */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-bold">Logo thương hiệu (Tải ảnh từ máy tính)</label>
                <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Preview" className="w-full h-full object-contain p-1" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-600" />
                    )}
                  </div>
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl cursor-pointer shadow-md">
                    <Upload className="w-4 h-4" />
                    <span>CHỌN FILE TỪ MÁY TÍNH</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Mô tả thương hiệu</label>
                <textarea
                  rows="2"
                  placeholder="Giới thiệu thương hiệu..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Thứ tự ưu tiên</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                    className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                  >
                    <option value={1}>Hiển thị Cửa hàng</option>
                    <option value={0}>Ẩn tạm thời</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingBrand ? 'Lưu cập nhật' : 'Xác nhận thêm'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
