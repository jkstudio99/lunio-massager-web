import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Plus, Pencil, Trash2, Star, X, Check,
} from 'lucide-react';
import { useI18n } from '@/store/i18n';
import { useAddressStore, type Address } from '@/store/address';
import { useToastStore } from '@/store/toast';
import { cn } from '@/lib/utils';

const emptyForm = {
  label: '',
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  district: '',
  postalCode: '',
  isDefault: false,
};

export default function AddressBookPage() {
  const { locale } = useI18n();
  const addToast = useToastStore((s) => s.addToast);
  const { addresses, addAddress, updateAddress, removeAddress, setDefault } = useAddressStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const t = {
    back: locale === 'zh-TW' ? '返回帳戶' : 'Back to Account',
    title: locale === 'zh-TW' ? '地址管理' : 'Address Book',
    addNew: locale === 'zh-TW' ? '新增地址' : 'Add Address',
    edit: locale === 'zh-TW' ? '編輯' : 'Edit',
    delete: locale === 'zh-TW' ? '刪除' : 'Delete',
    setDefault: locale === 'zh-TW' ? '設為預設' : 'Set Default',
    default: locale === 'zh-TW' ? '預設地址' : 'Default',
    save: locale === 'zh-TW' ? '儲存地址' : 'Save Address',
    cancel: locale === 'zh-TW' ? '取消' : 'Cancel',
    empty: locale === 'zh-TW' ? '尚無地址' : 'No addresses yet',
    emptyDesc: locale === 'zh-TW' ? '新增您的配送地址，方便快速結帳' : 'Add a shipping address for faster checkout',
    label: locale === 'zh-TW' ? '地址標籤' : 'Label',
    labelPlaceholder: locale === 'zh-TW' ? '例如：住家、公司' : 'e.g., Home, Office',
    fullName: locale === 'zh-TW' ? '收件人姓名' : 'Full Name',
    phone: locale === 'zh-TW' ? '聯絡電話' : 'Phone',
    address1: locale === 'zh-TW' ? '地址第一行' : 'Address Line 1',
    address2: locale === 'zh-TW' ? '地址第二行 (選填)' : 'Address Line 2 (optional)',
    city: locale === 'zh-TW' ? '縣市' : 'City',
    district: locale === 'zh-TW' ? '區域' : 'District',
    postalCode: locale === 'zh-TW' ? '郵遞區號' : 'Postal Code',
    makeDefault: locale === 'zh-TW' ? '設為預設地址' : 'Set as default',
    confirmDelete: locale === 'zh-TW' ? '確認刪除此地址？' : 'Delete this address?',
    saved: locale === 'zh-TW' ? '地址已儲存' : 'Address saved',
    deleted: locale === 'zh-TW' ? '地址已刪除' : 'Address deleted',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateAddress(editingId, form);
    } else {
      addAddress(form);
    }
    addToast(t.saved, 'success');
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (addr: Address) => {
    setForm({
      label: addr.label,
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2,
      city: addr.city,
      district: addr.district,
      postalCode: addr.postalCode,
      isDefault: addr.isDefault,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    removeAddress(id);
    setDeleteConfirm(null);
    addToast(t.deleted, 'info');
  };

  const inputCls = 'w-full h-11 px-4 border border-default rounded-lg bg-surface text-primary focus:outline-none focus:border-crocus focus:ring-2 focus:ring-crocus/20 text-sm';

  return (
    <div className="bg-surface min-h-screen">
      <div className="mx-auto max-w-[680px] px-6 py-10 lg:py-16">
        <Link to="/account" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-crocus transition-colors mb-6">
          <ArrowLeft size={16} />
          {t.back}
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary tracking-[-0.02em]">{t.title}</h1>
          {!showForm && (
            <button
              onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-crocus hover:bg-crocus-hover text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Plus size={16} />
              {t.addNew}
            </button>
          )}
        </div>

        {/* Add / Edit form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="overflow-hidden mb-6"
            >
              <div className="p-5 rounded-2xl border border-crocus/30 bg-crocus/5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-primary">
                    {editingId ? t.edit : t.addNew}
                  </p>
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="text-muted hover:text-primary">
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-secondary mb-1">{t.label}</label>
                    <input
                      className={inputCls}
                      value={form.label}
                      onChange={(e) => setForm({ ...form, label: e.target.value })}
                      placeholder={t.labelPlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-secondary mb-1">{t.fullName}</label>
                    <input
                      className={inputCls}
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-secondary mb-1">{t.phone}</label>
                  <input
                    className={inputCls}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-secondary mb-1">{t.address1}</label>
                  <input
                    className={inputCls}
                    value={form.addressLine1}
                    onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-secondary mb-1">{t.address2}</label>
                  <input
                    className={inputCls}
                    value={form.addressLine2}
                    onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-secondary mb-1">{t.city}</label>
                    <input
                      className={inputCls}
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-secondary mb-1">{t.district}</label>
                    <input
                      className={inputCls}
                      value={form.district}
                      onChange={(e) => setForm({ ...form, district: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-secondary mb-1">{t.postalCode}</label>
                    <input
                      className={inputCls}
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                    className="w-4 h-4 accent-crocus rounded"
                  />
                  <span className="text-xs text-secondary">{t.makeDefault}</span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 h-11 bg-crocus hover:bg-crocus-hover text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Check size={16} />
                    {t.save}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditingId(null); }}
                    className="px-6 h-11 border border-default rounded-lg text-sm font-medium text-secondary hover:bg-surface-alt transition-colors"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Address list */}
        {addresses.length === 0 && !showForm ? (
          <div className="text-center py-20">
            <MapPin size={48} className="mx-auto mb-4 text-muted" />
            <p className="text-lg font-semibold text-primary mb-2">{t.empty}</p>
            <p className="text-sm text-muted">{t.emptyDesc}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr, i) => (
              <motion.div
                key={addr.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'p-5 rounded-2xl border transition-all',
                  addr.isDefault ? 'border-crocus/40 bg-crocus/5' : 'border-default bg-surface'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-crocus" />
                    <span className="text-sm font-bold text-primary">
                      {addr.label || (locale === 'zh-TW' ? '地址' : 'Address')}
                    </span>
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-crocus/10 text-crocus text-[10px] font-semibold rounded-full">
                        <Star size={10} />
                        {t.default}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(addr)}
                      className="p-1.5 rounded-lg text-muted hover:text-crocus hover:bg-crocus/10 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(addr.id)}
                      className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-sm font-medium text-primary">{addr.fullName}</p>
                <p className="text-sm text-secondary mt-1">{addr.phone}</p>
                <p className="text-sm text-secondary mt-1">
                  {addr.addressLine1}
                  {addr.addressLine2 && `, ${addr.addressLine2}`}
                </p>
                <p className="text-sm text-secondary">
                  {addr.district}, {addr.city} {addr.postalCode}
                </p>

                {!addr.isDefault && (
                  <button
                    onClick={() => setDefault(addr.id)}
                    className="mt-3 text-xs text-crocus hover:text-crocus-hover font-medium transition-colors"
                  >
                    {t.setDefault}
                  </button>
                )}

                {/* Delete confirmation */}
                <AnimatePresence>
                  {deleteConfirm === addr.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-default flex items-center justify-between">
                        <p className="text-xs text-red-500 font-medium">{t.confirmDelete}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(addr.id)}
                            className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors"
                          >
                            {t.delete}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1.5 border border-default text-xs font-medium text-secondary rounded-lg hover:bg-surface-alt transition-colors"
                          >
                            {t.cancel}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
