import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Package, TrendingUp, Clock, LayoutGrid, Search, Users, Shield, Activity, Trash2, CheckCircle, XCircle, BarChart3, Mail, Edit, Upload, FileSpreadsheet, List, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import * as XLSX from 'xlsx';

import { Navbar } from "@/src/components/layout/Navbar";
import { HeroSection } from "@/src/components/layout/sections/HeroSection";
import { SponsorsSection } from "@/src/components/layout/sections/SponsorsSection";
import { BenefitsSection } from "@/src/components/layout/sections/BenefitsSection";
import { FeaturesSection } from "@/src/components/layout/sections/FeaturesSection";
import { ServicesSection } from "@/src/components/layout/sections/ServicesSection";
import { TestimonialSection } from "@/src/components/layout/sections/TestimonialSection";
import { TeamSection } from "@/src/components/layout/sections/TeamSection";
import { CommunitySection } from "@/src/components/layout/sections/CommunitySection";
import { PricingSection } from "@/src/components/layout/sections/PricingSection";
import { ContactSection } from "@/src/components/layout/sections/ContactSection";
import { FAQSection } from "@/src/components/layout/sections/FAQSection";
import { FooterSection } from "@/src/components/layout/sections/FooterSection";


const SECTORS = [
  'Tekstil & Hazır Giyim', 'Elektronik & Teknoloji', 'Gıda & İçecek',
  'İnşaat & Yapı Malzemeleri', 'Makine & Ekipman', 'Kimya & Plastik',
  'Otomotiv & Yedek Parça', 'Tarım & Hayvancılık', 'Mobilya & Dekorasyon',
  'Ambalaj & Baskı', 'Sağlık & Medikal', 'Diğer',
];

function BackButton({ to, label = "Geri Dön" }: { to?: string, label?: string }) {
  const navigate = useNavigate();
  const content = (
    <>
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      <span className="font-black uppercase tracking-widest text-[10px]">{label}</span>
    </>
  );

  const className = "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-100/50 transition-all mb-8 group no-underline shadow-sm";

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <button onClick={() => navigate(-1)} className={className}>
      {content}
    </button>
  );
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.');
      }

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('userRole', data.role);
      navigate('/');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 pt-28 text-slate-900 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100 p-12 border border-slate-100">
        <BackButton to="/" label="Ana Sayfaya Dön" />
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mt-2 tracking-tight">Tekrar Merhaba!</h1>
          <p className="text-slate-500 mt-3 font-medium text-lg">Hesabınıza güvenle erişin.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-xl animate-pulse">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">E-posta Adresi</label>
            <input 
              required
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="eposta@adresiniz.com" 
              className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all font-medium bg-slate-50"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Şifre</label>
            <div className="relative">
              <input 
                required
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all font-medium bg-slate-50 pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-2"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition transform shadow-xl shadow-blue-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="text-center mt-10 text-slate-500 font-medium text-lg">
          Hesabınız yok mu? <br />
          <Link to="/register" className="text-blue-600 font-black hover:underline underline-offset-4">
            Ücretsiz Kayıt Olun
          </Link>
        </p>
      </div>
    </main>
  );
}

function RegisterPage() {
  const [role, setRole] = useState<'buyer' | 'supplier' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!role) { setError('Lütfen hesap türünüzü seçin.'); return; }
    setError('');
    setLoading(true);

    const f = e.currentTarget;
    const body: any = {
      email: (f.elements.namedItem('email') as HTMLInputElement).value,
      password: (f.elements.namedItem('password') as HTMLInputElement).value,
      phone: (f.elements.namedItem('phone') as HTMLInputElement).value,
      role,
    };

    if (role === 'buyer') {
      body.fullName = (f.elements.namedItem('fullName') as HTMLInputElement).value;
    } else {
      body.companyName = (f.elements.namedItem('companyName') as HTMLInputElement).value;
      body.taxNumber = (f.elements.namedItem('taxNumber') as HTMLInputElement).value;
    }

    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Kayıt sırasında bir hata oluştu.');
      }
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('userRole', data.role);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 pt-28 font-sans">
      <div className="w-full max-w-lg">
        <BackButton to="/" label="Ana Sayfaya Dön" />
        <div className="text-center mb-10">
          <p className="text-slate-500 mt-2 font-medium">Hesap oluşturun, toplu alım gücünü keşfedin.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-xl">
              ⚠️ {error}
            </div>
          )}

          <div className="mb-8">
            <p className="text-sm font-bold text-slate-700 mb-3">Hesap türünüzü seçin</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all text-center cursor-pointer ${
                  role === 'buyer'
                    ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                {role === 'buyer' && (
                  <span className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                )}
                <span className="text-4xl mb-3">🛒</span>
                <span className="font-black text-slate-800 text-lg">Alıcı</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('supplier')}
                className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all text-center cursor-pointer ${
                  role === 'supplier'
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100'
                    : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                }`}
              >
                {role === 'supplier' && (
                  <span className="absolute top-3 right-3 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                )}
                <span className="text-4xl mb-3">🏭</span>
                <span className="font-black text-slate-800 text-lg">Satıcı</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {role === 'buyer' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Ad Soyad</label>
                <input name="fullName" required placeholder="Adınız Soyadınız" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-slate-800" />
              </div>
            )}

            {role === 'supplier' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Şirket Adı</label>
                  <input name="companyName" required placeholder="Şirket Adı A.Ş." className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-medium text-slate-800" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Vergi Numarası</label>
                  <input name="taxNumber" placeholder="1234567890" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-medium text-slate-800" />
                </div>
              </>
            )}

            {role && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">E-posta</label>
                  <input name="email" type="email" required placeholder="eposta@adresiniz.com" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-slate-800" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Telefon</label>
                  <input name="phone" type="tel" required placeholder="0532 000 00 00" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-slate-800" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Şifre</label>
                  <div className="relative">
                    <input 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      required 
                      minLength={6} 
                      placeholder="En az 6 karakter" 
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-slate-800 pr-12" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-2"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className={`w-full py-4 rounded-2xl font-black text-white text-lg transition-all shadow-xl mt-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${role === 'supplier' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}>
                  {loading ? 'Kayıt Yapılıyor...' : 'Hesap Oluştur'}
                </button>
              </>
            )}
          </form>

          <p className="text-center mt-8 text-slate-500 font-medium">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="text-blue-600 font-black hover:underline underline-offset-4">
              Giriş Yapın
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function ProfilePage() {
  const [profile, setProfile] = useState<any>({});
  const [role, setRole] = useState<string>('buyer');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }

      try {
        const meRes = await fetch('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) { navigate('/login'); return; }
        const me = await meRes.json();

        setRole(me.role || 'buyer');
        setUserEmail(me.email || '');

        const pRes = await fetch('/profiles/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (pRes.ok) {
          const p = await pRes.json();
          setProfile(p || {});
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/profiles/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setMessage('✅ Profiliniz başarıyla güncellendi!');
      } else {
        setMessage('❌ Güncelleme başarısız.');
      }
    } catch {
      setMessage('❌ Sunucu bağlantı hatası.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfile({ ...profile, avatarBase64: reader.result as string });
    reader.readAsDataURL(file);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

  const isSupplier = role === 'supplier';
  const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-slate-800 text-sm";
  const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-10 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <BackButton to="/" label="Ana Sayfaya Dön" />
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black text-slate-800">Profil Ayarları</h1>
          <span className={`text-xs font-black px-3 py-1 rounded-full ${isSupplier ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
            {isSupplier ? '🏭 Satıcı Hesabı' : '🛒 Alıcı Hesabı'}
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-6">
              <div className="relative flex-shrink-0">
                <div onClick={() => fileRef.current?.click()} className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 overflow-hidden cursor-pointer hover:border-blue-400 transition flex items-center justify-center group">
                  {profile.avatarBase64 ? <img src={profile.avatarBase64} alt="avatar" className="w-full h-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" /> : <span className="text-3xl">📷</span>}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${isSupplier ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                  {isSupplier ? '🏭 Satıcı' : '🛒 Alıcı'}
                </span>
                <p className="text-slate-400 text-sm font-medium truncate">{userEmail}</p>
                <h1 className="text-xl font-black text-slate-800 mt-0.5 truncate">
                  {isSupplier ? (profile.companyName || 'Şirket adı girilmemiş') : (profile.fullName || 'İsim girilmemiş')}
                </h1>
              </div>
            </div>
          </div>

          {message && <div className={`p-4 rounded-2xl text-sm font-bold ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message}</div>}

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h2 className="text-lg font-black text-slate-800 mb-6">{isSupplier ? 'Şirket Bilgileri' : 'Kişisel Bilgiler'}</h2>
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className={labelCls}>{isSupplier ? 'Şirket Adı *' : 'Ad Soyad *'}</label>
                <input value={isSupplier ? profile.companyName || '' : profile.fullName || ''} onChange={(e) => setProfile({ ...profile, [isSupplier ? 'companyName' : 'fullName']: e.target.value })} required className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Telefon</label>
                  <input value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Sektör</label>
                  <select value={profile.sector || ''} onChange={(e) => setProfile({ ...profile, sector: e.target.value })} className={inputCls}>
                    <option value="">Sektör seçin...</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Adres</label>
                <textarea value={profile.address || ''} onChange={(e) => setProfile({ ...profile, address: e.target.value })} rows={3} className={inputCls + ' resize-none'} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className={`w-full py-4 rounded-2xl font-black text-white text-lg transition-all shadow-xl ${isSupplier ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </form>
      </div>
    </main>
  );
}

function HomePage() {
  const token = localStorage.getItem('token');
  const [groupBuys, setGroupBuys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'new' | 'popular'>('new');
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch group buys
        const res = await fetch('/api/group-buys');
        const data = await res.json();
        setGroupBuys(data);

        // Fetch user info if logged in
        if (token) {
          const meRes = await fetch('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (meRes.ok) {
            const me = await meRes.json();
            setUserRole(me.role);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const sortedGroupBuys = [...groupBuys].sort((a, b) => {
    if (activeTab === 'new') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      // Sort by progress percentage for "popular"
      const progressA = a.currentQuantity / a.targetQuantity;
      const progressB = b.currentQuantity / b.targetQuantity;
      return progressB - progressA;
    }
  });

  const renderGroupBuyCard = (gb: any) => {
    const progress = (gb.currentQuantity / gb.targetQuantity) * 100;
    const now = new Date().getTime();
    const start = new Date(gb.createdAt).getTime();
    const end = new Date(gb.deadline).getTime();
    const totalTime = end - start;
    const timePassed = now - start;
    const timeProgress = Math.min(100, Math.max(0, (timePassed / totalTime) * 100));
    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

    let firstImage = null;
    if (gb.imagesBase64) {
      try {
        const imgs = JSON.parse(gb.imagesBase64);
        if (imgs.length > 0) firstImage = imgs[0];
      } catch (e) {}
    }

    return (
      <div key={gb.id} onClick={() => navigate(`/group-buys/${gb.id}`)} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group cursor-pointer">
        {firstImage && (
          <div className="aspect-video w-full overflow-hidden">
            <img src={firstImage} alt={gb.productName} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" crossOrigin="anonymous" referrerPolicy="no-referrer" />
          </div>
        )}
        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-blue-50 text-blue-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {gb.category || 'Genel'}
            </span>
            <span className="text-slate-400 text-xs font-bold">{daysLeft > 0 ? `${daysLeft} gün kaldı` : 'Süre doldu'}</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition">{gb.productName}</h3>
          
          <div className="flex items-end gap-1 mb-6">
            <span className="text-3xl font-black text-slate-900">{gb.unitPrice}₺</span>
            <span className="text-slate-400 font-bold mb-1">/ {gb.unit}</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-500">Katılım</span>
                <span className="text-blue-600">%{Math.min(100, Math.round(progress))}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500" 
                  style={{ width: `${Math.min(100, progress)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-500">Kalan Süre</span>
                <span className="text-emerald-600">%{Math.max(0, 100 - Math.round(timeProgress))}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-500" 
                  style={{ width: `${Math.max(0, 100 - timeProgress)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-slate-900 font-sans">
      {!token && <HeroSection />}
      
      <div id="listings" className={`max-w-7xl mx-auto px-6 lg:px-10 py-12 ${token ? 'pt-28' : ''}`}>
        {token && (
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div 
              onClick={() => navigate('/group-buys')}
              className="bg-blue-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-blue-200 cursor-pointer hover:scale-[1.02] transition transform group"
            >
              <div className="text-5xl mb-6">🔍</div>
              <h2 className="text-4xl font-black mb-4">İlanları Gör</h2>
              <p className="text-blue-100 text-lg font-medium mb-8">Aktif grup alımlarını inceleyin, toplu alım gücüne hemen ortak olun.</p>
              <span className="inline-flex items-center gap-2 font-black text-xl group-hover:gap-4 transition-all">
                Keşfetmeye Başla →
              </span>
            </div>

            <div 
              onClick={() => navigate('/group-buys/create')}
              className="bg-emerald-500 rounded-[3rem] p-12 text-white shadow-2xl shadow-emerald-200 cursor-pointer hover:scale-[1.02] transition transform group"
            >
              <div className="text-5xl mb-6">📢</div>
              <h2 className="text-4xl font-black mb-4">İlan Aç</h2>
              <p className="text-emerald-50/80 text-lg font-medium mb-8">Kendi ürününüz için grup alımı başlatın, binlerce alıcıya tek seferde ulaşın.</p>
              <span className="inline-flex items-center gap-2 font-black text-xl group-hover:gap-4 transition-all">
                Kampanya Başlat →
              </span>
            </div>
          </div>
        )}

        <div className="mb-12">
          {!token && (
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Aktif Fırsatlar</h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto">Şu anda devam eden en popüler ve yeni grup alımlarını keşfedin.</p>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-8">
              <button 
                onClick={() => setActiveTab('new')}
                className={`text-2xl font-black pb-2 transition-all ${activeTab === 'new' ? 'text-slate-900 border-b-4 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Yeni İlanlar
              </button>
              <button 
                onClick={() => setActiveTab('popular')}
                className={`text-2xl font-black pb-2 transition-all ${activeTab === 'popular' ? 'text-slate-900 border-b-4 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Popüler İlanlar
              </button>
            </div>
            <Link to="/group-buys" className="text-blue-600 font-black hover:underline underline-offset-4">Tümünü Gör</Link>
          </div>

          {loading ? (
            <div className="py-20 text-center font-bold text-slate-400">Yükleniyor...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedGroupBuys.slice(0, 6).map(renderGroupBuyCard)}
              {sortedGroupBuys.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                  <p className="text-xl font-black text-slate-400">Henüz ilan bulunmuyor.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {!token && (
        <>
          <BenefitsSection />
          <FeaturesSection />
          <ServicesSection />
          <TestimonialSection />
          <PricingSection />
          <FAQSection />
          <ContactSection />
        </>
      )}
      <FooterSection />
    </div>
  );
}

function GroupBuyPage() {
  const [groupBuys, setGroupBuys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/group-buys')
      .then(res => res.json())
      .then(data => {
        const searchParams = new URLSearchParams(location.search);
        const filter = searchParams.get('filter');
        const search = searchParams.get('search')?.toLowerCase();
        
        let filteredData = [...data];

        if (search) {
          filteredData = filteredData.filter(gb => 
            gb.productName.toLowerCase().includes(search) || 
            gb.description.toLowerCase().includes(search) ||
            gb.category?.toLowerCase().includes(search)
          );
        }

        if (filter === 'popular') {
          filteredData.sort((a, b) => (b.currentQuantity / b.targetQuantity) - (a.currentQuantity / a.targetQuantity));
        } else if (filter === 'new') {
          filteredData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        
        setGroupBuys(filteredData);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [location.search]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-10 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <BackButton to="/" label="Ana Sayfaya Dön" />
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Aktif Grup Alımları</h1>
          <Link to="/group-buys/create" className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-100 no-underline">
            + Yeni Alım Başlat
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groupBuys.map((gb) => {
            const progress = (gb.currentQuantity / gb.targetQuantity) * 100;
            const now = new Date().getTime();
            const start = new Date(gb.createdAt).getTime();
            const end = new Date(gb.deadline).getTime();
            const totalTime = end - start;
            const timePassed = now - start;
            const timeProgress = Math.min(100, Math.max(0, (timePassed / totalTime) * 100));
            const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

            return (
              <div key={gb.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                {(() => {
                  let firstImage = null;
                  if (gb.imagesBase64) {
                    try {
                      const imgs = JSON.parse(gb.imagesBase64);
                      if (imgs.length > 0) firstImage = imgs[0];
                    } catch (e) {}
                  }
                  return firstImage ? (
                    <div className="aspect-video w-full overflow-hidden">
                      <img src={firstImage} alt={gb.productName} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                    </div>
                  ) : null;
                })()}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-50 text-blue-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                      {gb.category || 'Genel'}
                    </span>
                    <span className="text-slate-400 text-xs font-bold">{daysLeft > 0 ? `${daysLeft} gün kaldı` : 'Süre doldu'}</span>
                  </div>
                  <Link to={`/group-buys/${gb.id}`} className="no-underline">
                    <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition">{gb.productName}</h3>
                  </Link>
                  <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2">{gb.description}</p>
                  
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-3xl font-black text-slate-900">{gb.unitPrice}₺</span>
                    <span className="text-slate-400 font-bold mb-1">/ {gb.unit}</span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-slate-500">Katılım</span>
                        <span className="text-blue-600">%{Math.min(100, Math.round(progress))}</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-500" 
                          style={{ width: `${Math.min(100, progress)}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-slate-500">Kalan Süre</span>
                        <span className="text-emerald-600">%{Math.max(0, 100 - Math.round(timeProgress))}</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-400 transition-all duration-500" 
                          style={{ width: `${Math.max(0, 100 - timeProgress)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest pt-2">
                      <span>{gb.currentQuantity} {gb.unit}</span>
                      <span>Hedef: {gb.targetQuantity} {gb.unit}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/group-buys/${gb.id}`)}
                    className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-blue-600 transition-all active:scale-95"
                  >
                    Detayları Gör & Katıl
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {groupBuys.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <span className="text-6xl mb-4 block">📦</span>
            <h3 className="text-xl font-black text-slate-400">Henüz aktif bir grup alımı bulunmuyor.</h3>
          </div>
        )}
      </div>
    </main>
  );
}

function CreateGroupBuyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) navigate('/login');
    fetchCategories();
  }, [token, navigate]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const f = e.currentTarget;
    const dateVal = (f.elements.namedItem('deadlineDate') as HTMLInputElement).value;
    const timeVal = (f.elements.namedItem('deadlineTime') as HTMLInputElement).value;

    const body = {
      productName: (f.elements.namedItem('productName') as HTMLInputElement).value,
      description: (f.elements.namedItem('description') as HTMLTextAreaElement).value,
      category: (f.elements.namedItem('category') as HTMLSelectElement).value,
      targetQuantity: parseFloat((f.elements.namedItem('targetQuantity') as HTMLInputElement).value),
      unitPrice: parseFloat((f.elements.namedItem('unitPrice') as HTMLInputElement).value),
      unit: (f.elements.namedItem('unit') as HTMLInputElement).value,
      deadline: new Date(`${dateVal}T${timeVal}`).toISOString(),
      imagesBase64: images,
    };

    try {
      const res = await fetch('/api/group-buys', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Grup alımı oluşturulamadı.');
      }
      navigate('/group-buys');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-10 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <BackButton to="/group-buys" label="Tüm İlanlara Dön" />
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mt-4 tracking-tight">Yeni Grup Alımı Başlat</h1>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
          {error && <div className="mb-6 p-4 bg-red-50 text-red-700 font-bold rounded-2xl">⚠️ {error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Ürün Fotoğrafları</label>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group">
                    <img src={img} alt={`preview-${idx}`} className="w-full h-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition"
                >
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-black uppercase">Yükle</span>
                </button>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Ürün Adı</label>
              <input name="productName" required placeholder="Örn: Organik Zeytinyağı" className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:border-blue-500 outline-none transition-all font-bold" />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Açıklama</label>
              <textarea name="description" rows={3} placeholder="Ürün detayları, kalite standartları vb." className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:border-blue-500 outline-none transition-all font-bold resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Kategori</label>
                <select name="category" className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:border-blue-500 outline-none transition-all font-bold">
                  {categories.length > 0 ? (
                    categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)
                  ) : (
                    SECTORS.map(s => <option key={s} value={s}>{s}</option>)
                  )}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Birim</label>
                <input name="unit" required placeholder="kg, adet, ton" className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:border-blue-500 outline-none transition-all font-bold" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Hedef Miktar</label>
                <input name="targetQuantity" type="number" step="0.01" required placeholder="1000" className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:border-blue-500 outline-none transition-all font-bold" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Birim Fiyat (₺)</label>
                <input name="unitPrice" type="number" step="0.01" required placeholder="150.00" className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:border-blue-500 outline-none transition-all font-bold" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Son Katılım Tarihi & Saati (24s)</label>
              <div className="grid grid-cols-2 gap-4">
                <input name="deadlineDate" type="date" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:border-blue-500 outline-none transition-all font-bold" />
                <input name="deadlineTime" type="time" step="60" required className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:border-blue-500 outline-none transition-all font-bold" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-600 transition shadow-xl shadow-emerald-100 disabled:opacity-50">
              {loading ? 'Oluşturuluyor...' : 'Grup Alımını Başlat'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function GroupBuyDetailPage() {
  const [gb, setGb] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [existingOrder, setExistingOrder] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editingGroupBuy, setEditingGroupBuy] = useState<any>(null);
  const [editingImages, setEditingImages] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchHistory = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDetail = async () => {
    try {
      const res = await fetch('/api/group-buys');
      const data = await res.json();
      const found = data.find((item: any) => item.id === id);
      
      if (found && found.imagesBase64) {
        try {
          found.images = JSON.parse(found.imagesBase64);
        } catch (e) {
          found.images = [];
        }
      } else if (found) {
        found.images = [];
      }
      
      setGb(found);

      if (token) {
        const meRes = await fetch('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const me = await meRes.json();
        setCurrentUser(me);

        if (found) {
          const ordersRes = await fetch('/api/my-orders', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (ordersRes.ok) {
            const orders = await ordersRes.json();
            const existing = orders.find((o: any) => o.groupBuyId === id);
            setExistingOrder(existing);
            if (existing) {
              setQuantity(existing.quantity);
              fetchHistory(existing.id);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id, token]);

  const handleJoin = async () => {
    if (!token) { navigate('/login'); return; }
    setJoining(true);
    setMessage('');

    try {
      const res = await fetch(`/api/group-buys/${id}/join`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity }),
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setMessage(existingOrder ? '✅ Siparişiniz başarıyla güncellendi.' : '✅ Başarıyla katıldınız! Siparişiniz oluşturuldu.');
        
        // İlanın toplam miktarını frontend'de de güncelle
        const oldOrderQty = existingOrder ? existingOrder.quantity : 0;
        const updatedGb = { ...gb, currentQuantity: gb.currentQuantity - oldOrderQty + quantity };
        
        setExistingOrder(updatedOrder);
        setGb(updatedGb);
        fetchHistory(updatedOrder.id);
      } else {
        const data = await res.json();
        setMessage(`❌ Hata: ${data.message}`);
      }
    } catch {
      setMessage('❌ Sunucu hatası.');
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  if (!gb) return <div className="min-h-screen flex items-center justify-center">Bulunamadı.</div>;

  const progress = (gb.currentQuantity / gb.targetQuantity) * 100;
  const isOwner = currentUser && gb.supplierId === currentUser.id;
  const isAdmin = currentUser && currentUser.role === 'admin';

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <BackButton to="/group-buys" label="Tüm Kampanyalar" />
        <div className="mb-8 flex items-center justify-between">
          <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Aktif Kampanya</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100">
              <div className="aspect-video bg-slate-100 relative group">
                {gb.images && gb.images.length > 0 ? (
                  <img src={gb.images[activeImage]} alt={gb.productName} className="w-full h-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Package className="w-20 h-20" />
                  </div>
                )}
                {(isOwner || isAdmin) && (
                  <button 
                    onClick={() => {
                      setEditingGroupBuy(gb);
                      setEditingImages(gb.images || []);
                    }}
                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur rounded-2xl text-indigo-600 shadow-lg hover:bg-indigo-600 hover:text-white transition opacity-0 group-hover:opacity-100"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
              </div>
              {gb.images && gb.images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {gb.images.map((img: string, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${activeImage === idx ? 'border-blue-500' : 'border-transparent'}`}
                    >
                      <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
              <h1 className="text-4xl font-black text-slate-900 mb-4 leading-tight">{gb.productName}</h1>
              <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8">{gb.description}</p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-3xl">
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Birim Fiyat</span>
                  <span className="text-2xl font-black text-slate-900">{gb.unitPrice}₺</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl">
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Birim</span>
                  <span className="text-2xl font-black text-slate-900">{gb.unit}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-6">Kampanya İlerlemesi</h3>
              <div className="space-y-4">
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000" 
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Toplanan</span>
                    <span className="text-2xl font-black text-blue-600">{gb.currentQuantity} {gb.unit}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Hedef</span>
                    <span className="text-2xl font-black text-slate-900">{gb.targetQuantity} {gb.unit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200 sticky top-10">
              <h3 className="text-2xl font-black mb-8">{existingOrder ? 'Siparişi Düzenle' : 'Alıma Katıl'}</h3>
              
              {message && <div className={`mb-6 p-4 rounded-2xl text-sm font-bold ${message.includes('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{message}</div>}

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                    {existingOrder ? 'Yeni Toplam Miktar' : 'Alım Miktarı'} ({gb.unit})
                  </label>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-2xl font-black">-</button>
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="flex-1 bg-white/10 border-none rounded-xl py-3 px-4 text-center text-xl font-black outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-2xl font-black">+</button>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-slate-400 font-bold">Toplam Tutar</span>
                    <span className="text-3xl font-black">{(quantity * gb.unitPrice).toFixed(2)}₺</span>
                  </div>
                  <button 
                    onClick={handleJoin}
                    disabled={joining}
                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {joining ? 'İşleniyor...' : (existingOrder ? 'Siparişi Güncelle' : 'Şimdi Katıl')}
                  </button>
                </div>
              </div>
            </div>

            {history.length > 0 && (
              <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                <h3 className="text-xl font-black text-slate-900 mb-6">Katılım Geçmişi</h3>
                <div className="space-y-6">
                  {history.map((h: any) => (
                    <div key={h.id} className="flex gap-4 items-start">
                      <div className={`w-2 h-2 rounded-full mt-2 ${h.action === 'create' ? 'bg-green-500' : 'bg-blue-500'}`} />
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {h.action === 'create' ? 'Alıma Katıldı' : 'Miktar Güncellendi'}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {h.oldQuantity > 0 && `${h.oldQuantity} ${gb.unit} → `}{h.newQuantity} {gb.unit}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                          {new Date(h.createdAt).toLocaleString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingGroupBuy && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-10 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">İlanı Düzenle</h2>
                  <p className="text-slate-500 font-medium">{editingGroupBuy.productName}</p>
                </div>
                <button onClick={() => setEditingGroupBuy(null)} className="p-2 hover:bg-slate-100 rounded-full transition">
                  <XCircle className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const payload = {
                  ...Object.fromEntries(formData.entries()),
                  unitPrice: parseFloat(formData.get('unitPrice') as string),
                  targetQuantity: parseFloat(formData.get('targetQuantity') as string),
                  imagesBase64: editingImages,
                };
                await fetch(`/api/group-buys/${editingGroupBuy.id}`, {
                  method: 'PATCH',
                  headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                  },
                  body: JSON.stringify(payload)
                });
                setEditingGroupBuy(null);
                fetchDetail();
              }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Ürün Fotoğrafları</label>
                  <div className="grid grid-cols-5 gap-3 mb-4">
                    {editingImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group">
                        <img src={img} alt={`preview-${idx}`} className="w-full h-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                        <button 
                          type="button"
                          onClick={() => setEditingImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.multiple = true;
                        input.accept = 'image/*';
                        input.onchange = (e: any) => {
                          const files = e.target.files;
                          if (!files) return;
                          Array.from(files).forEach((file: any) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setEditingImages(prev => [...prev, reader.result as string]);
                            };
                            reader.readAsDataURL(file);
                          });
                        };
                        input.click();
                      }}
                      className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition"
                    >
                      <Upload className="w-5 h-5 mb-1" />
                      <span className="text-[8px] font-black uppercase">Yükle</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Ürün Adı</label>
                  <input name="productName" defaultValue={editingGroupBuy.productName} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Birim Fiyat (TL)</label>
                    <input name="unitPrice" type="number" step="0.01" defaultValue={editingGroupBuy.unitPrice} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Hedef Miktar</label>
                    <input name="targetQuantity" type="number" defaultValue={editingGroupBuy.targetQuantity} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Kategori</label>
                    <input name="category" defaultValue={editingGroupBuy.category} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Durum</label>
                    <select name="status" defaultValue={editingGroupBuy.status} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500">
                      <option value="active">Aktif</option>
                      <option value="completed">Tamamlandı</option>
                      <option value="cancelled">İptal Edildi</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-200">
                  İlanı Güncelle
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}


function MyListingsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingGroupBuy, setEditingGroupBuy] = useState<any>(null);
  const [editingImages, setEditingImages] = useState<string[]>([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchMyData = async () => {
    if (!token) { navigate('/login'); return; }
    setLoading(true);
    try {
      const meRes = await fetch('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const me = await meRes.json();
      setRole(me.role);

      if (me.role === 'supplier') {
        const res = await fetch('/api/group-buys');
        const data = await res.json();
        setItems(data.filter((gb: any) => gb.supplierId === me.id));
      } else {
        const res = await fetch('/api/my-orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyData();
  }, [token, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-10 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <BackButton to="/" label="Ana Sayfaya Dön" />
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {role === 'supplier' ? 'Açtığım İlanlar' : 'Katıldığım İlanlar'}
          </h1>
          <p className="text-slate-500 font-medium mt-2">Tüm aktivitelerinizi buradan takip edebilirsiniz.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => {
            const gb = role === 'supplier' ? item : item.groupBuy;
            if (!gb) return null;
            
            const progress = (gb.currentQuantity / gb.targetQuantity) * 100;
            const now = new Date().getTime();
            const start = new Date(gb.createdAt).getTime();
            const end = new Date(gb.deadline).getTime();
            const totalTime = end - start;
            const timePassed = now - start;
            const timeProgress = Math.min(100, Math.max(0, (timePassed / totalTime) * 100));
            
            return (
              <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group relative">
                <div className="p-8" onClick={() => navigate(`/group-buys/${gb.id}`)}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-50 text-blue-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                      {gb.category || 'Genel'}
                    </span>
                    {role === 'buyer' && (
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase">
                        {item.quantity} {gb.unit} Sipariş
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition">{gb.productName}</h3>
                  
                  <div className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-slate-500">Katılım</span>
                        <span className="text-blue-600">%{Math.min(100, Math.round(progress))}</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-500" 
                          style={{ width: `${Math.min(100, progress)}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-slate-500">Kalan Süre</span>
                        <span className="text-emerald-600">%{Math.max(0, 100 - Math.round(timeProgress))}</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-400 transition-all duration-500" 
                          style={{ width: `${Math.max(0, 100 - timeProgress)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {role === 'supplier' && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingGroupBuy(gb);
                        try {
                          setEditingImages(gb.imagesBase64 ? JSON.parse(gb.imagesBase64) : []);
                        } catch (e) {
                          setEditingImages([]);
                        }
                      }}
                      className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <p className="text-xl font-black text-slate-400">Henüz bir kaydınız bulunmuyor.</p>
            <Link to="/group-buys" className="inline-block mt-4 text-blue-600 font-black hover:underline">İlanları Keşfet →</Link>
          </div>
        )}

        {/* Edit Modal */}
        {editingGroupBuy && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-10 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">İlanı Düzenle</h2>
                    <p className="text-slate-500 font-medium">{editingGroupBuy.productName}</p>
                  </div>
                  <button onClick={() => setEditingGroupBuy(null)} className="p-2 hover:bg-slate-100 rounded-full transition">
                    <XCircle className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const payload = {
                    ...Object.fromEntries(formData.entries()),
                    unitPrice: parseFloat(formData.get('unitPrice') as string),
                    targetQuantity: parseFloat(formData.get('targetQuantity') as string),
                    imagesBase64: editingImages,
                  };
                  await fetch(`/api/group-buys/${editingGroupBuy.id}`, {
                    method: 'PATCH',
                    headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(payload)
                  });
                  setEditingGroupBuy(null);
                  fetchMyData();
                }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Ürün Fotoğrafları</label>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      {editingImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group">
                          <img src={img} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setEditingImages(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.multiple = true;
                          input.accept = 'image/*';
                          input.onchange = (e: any) => {
                            const files = e.target.files;
                            if (!files) return;
                            Array.from(files).forEach((file: any) => {
                              const reader = new FileReader();
                              reader.onload = () => {
                                setEditingImages(prev => [...prev, reader.result as string]);
                              };
                              reader.readAsDataURL(file);
                            });
                          };
                          input.click();
                        }}
                        className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition"
                      >
                        <Upload className="w-5 h-5 mb-1" />
                        <span className="text-[8px] font-black uppercase">Yükle</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Ürün Adı</label>
                    <input name="productName" defaultValue={editingGroupBuy.productName} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Birim Fiyat (TL)</label>
                      <input name="unitPrice" type="number" step="0.01" defaultValue={editingGroupBuy.unitPrice} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Hedef Miktar</label>
                      <input name="targetQuantity" type="number" defaultValue={editingGroupBuy.targetQuantity} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Kategori</label>
                      <input name="category" defaultValue={editingGroupBuy.category} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Durum</label>
                      <select name="status" defaultValue={editingGroupBuy.status} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500">
                        <option value="active">Aktif</option>
                        <option value="completed">Tamamlandı</option>
                        <option value="cancelled">İptal Edildi</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-200">
                    İlanı Güncelle
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [groupBuys, setGroupBuys] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingGroupBuy, setEditingGroupBuy] = useState<any>(null);
  const [editingImages, setEditingImages] = useState<string[]>([]);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [messagingUser, setMessagingUser] = useState<any>(null);
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (userRole !== 'admin') return;
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const endpoint = activeTab === 'overview' ? '/api/admin/stats' : 
                       activeTab === 'users' ? '/api/admin/users' : 
                       activeTab === 'categories' ? '/api/admin/categories' :
                       '/api/admin/group-buys';
      
      const res = await fetch(endpoint, { headers });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (activeTab === 'overview') {
        setStats(data);
      } else if (activeTab === 'users') {
        setUsers(Array.isArray(data) ? data : []);
      } else if (activeTab === 'group-buys') {
        setGroupBuys(Array.isArray(data) ? data : []);
      } else if (activeTab === 'categories') {
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Admin Dashboard Fetch Error:", err);
      // Hata durumunda listeleri boşaltma, mevcut veriyi koru veya kullanıcıya bildir
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/admin/users/${id}`, { 
      method: 'DELETE', 
      headers: { Authorization: `Bearer ${token}` } 
    });
    fetchData();
  };

  const deleteGroupBuy = async (id: string) => {
    if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/admin/group-buys/${id}`, { 
      method: 'DELETE', 
      headers: { Authorization: `Bearer ${token}` } 
    });
    fetchData();
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/group-buys/${id}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const handleCategoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        const res = await fetch('/api/admin/categories/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ categories: data })
        });
        
        if (res.ok) {
          alert('Kategoriler başarıyla yüklendi.');
          fetchData();
        } else {
          const err = await res.json();
          alert('Hata: ' + err.message);
        }
      } catch (err) {
        console.error(err);
        alert('Yükleme sırasında bir hata oluştu. Lütfen Excel formatını kontrol edin.');
      }
    };
    reader.readAsBinaryString(file);
    // Reset input
    e.target.value = '';
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchData();
  };

  if (userRole !== 'admin') return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-slate-50 flex pt-20">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <div className="mb-10">
          <h2 className="text-xl font-black italic tracking-tighter text-blue-400">ADMIN PANEL</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Minga GPO Management</p>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'overview', label: 'Genel Bakış', icon: BarChart3 },
            { id: 'users', label: 'Kullanıcılar', icon: Users },
            { id: 'group-buys', label: 'İlanlar', icon: Package },
            { id: 'categories', label: 'Kategori Yönetimi', icon: List },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/10">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition no-underline text-sm font-bold">
            <LayoutGrid className="w-5 h-5" />
            Siteye Dön
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        <BackButton to="/" label="Ana Sayfaya Dön" />
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              {activeTab === 'overview' ? 'Genel Bakış' : 
               activeTab === 'users' ? 'Kullanıcı Yönetimi' : 
               activeTab === 'categories' ? 'Kategori Yönetimi' :
               'İlan Yönetimi'}
            </h1>
            <p className="text-slate-500 font-medium">Sistemdeki tüm verileri buradan kontrol edebilirsiniz.</p>
          </div>
          <button onClick={fetchData} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition">
            <Activity className="w-5 h-5 text-slate-600" />
          </button>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-400 font-bold">Yükleniyor...</div>
        ) : (
          <>
            {activeTab === 'overview' && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Toplam Kullanıcı', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', tab: 'users' },
                  { label: 'Toplam İlan', value: stats.totalGroupBuys, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-100', tab: 'group-buys' },
                  { label: 'Aktif İlanlar', value: stats.activeGroupBuys, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100', tab: 'group-buys' },
                  { label: 'Toplam Sipariş', value: stats.totalOrders, icon: Shield, color: 'text-rose-600', bg: 'bg-rose-100', tab: 'overview' },
                ].map((stat, i) => (
                  <div 
                    key={i} 
                    onClick={() => stat.tab !== 'overview' && setActiveTab(stat.tab)}
                    className={`bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-300 ${stat.tab !== 'overview' ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-blue-200' : ''}`}
                  >
                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Kullanıcı</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Rol</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Durum</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Tarih</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                          <p className="text-slate-400 font-bold">Kayıtlı kullanıcı bulunamadı.</p>
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{user.email}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{user.id}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              user.role === 'admin' ? 'bg-rose-100 text-rose-600' : 
                              user.role === 'supplier' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`flex items-center gap-1.5 text-xs font-bold ${user.isActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {user.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                              {user.isActive ? 'Aktif' : 'Pasif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-500">
                            {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => setMessagingUser(user)}
                                className="p-2 text-slate-400 hover:text-blue-600 transition"
                                title="Mesaj Gönder"
                              >
                                <Mail className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={async () => {
                                  const res = await fetch(`/api/admin/users/${user.id}/profile`, {
                                    headers: { Authorization: `Bearer ${token}` }
                                  });
                                  const data = await res.json();
                                  setEditingUser(data);
                                }}
                                className="p-2 text-slate-400 hover:text-indigo-600 transition"
                                title="Profili Düzenle"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => deleteUser(user.id)}
                                disabled={user.role === 'admin'}
                                className="p-2 text-slate-400 hover:text-rose-600 transition disabled:opacity-30"
                                title="Kullanıcıyı Sil"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'group-buys' && (
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">İlan</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">İlerleme</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Durum</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupBuys.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-20 text-center">
                          <p className="text-slate-400 font-bold">Kayıtlı ilan bulunamadı.</p>
                        </td>
                      </tr>
                    ) : (
                      groupBuys.map((gb) => (
                        <tr key={gb.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{gb.productName}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{gb.category}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
                              <div className="h-full bg-blue-500" style={{ width: `${(gb.currentQuantity / gb.targetQuantity) * 100}%` }} />
                            </div>
                            <p className="text-[10px] font-bold text-slate-500">%{Math.round((gb.currentQuantity / gb.targetQuantity) * 100)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              value={gb.status}
                              onChange={(e) => updateStatus(gb.id, e.target.value)}
                              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold outline-none focus:border-blue-500"
                            >
                              <option value="active">Aktif</option>
                              <option value="completed">Tamamlandı</option>
                              <option value="cancelled">İptal Edildi</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => {
                                  setEditingGroupBuy(gb);
                                  try {
                                    setEditingImages(gb.imagesBase64 ? JSON.parse(gb.imagesBase64) : []);
                                  } catch (e) {
                                    setEditingImages([]);
                                  }
                                }}
                                className="p-2 text-slate-400 hover:text-indigo-600 transition"
                                title="İlanı Düzenle"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => deleteGroupBuy(gb.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 transition"
                                title="İlanı Sil"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Kategori Yönetimi</h3>
                      <p className="text-sm text-slate-500 font-medium">Excel ile toplu yükleme yapabilir veya ilanlardaki kategorileri senkronize edebilirsiniz.</p>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={fetchData}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition"
                      >
                        <Activity className="w-5 h-5" />
                        Senkronize Et
                      </button>
                      <label className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm cursor-pointer hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                        <Upload className="w-5 h-5" />
                        Excel Yükle
                        <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleCategoryUpload} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori Adı</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Açıklama</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">İkon</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-20 text-center">
                            <p className="text-slate-400 font-bold italic">Henüz kategori eklenmemiş.</p>
                          </td>
                        </tr>
                      ) : (
                        categories.map((cat) => (
                          <tr key={cat.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                            <td className="px-6 py-4 font-bold text-slate-900">{cat.name}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">{cat.description || '-'}</td>
                            <td className="px-6 py-4 text-sm text-slate-400 font-mono">{cat.icon || '-'}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => setEditingCategory(cat)}
                                  className="p-2 text-slate-400 hover:text-blue-600 transition"
                                  title="Kategoriyi Düzenle"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => deleteCategory(cat.id)}
                                  className="p-2 text-slate-400 hover:text-rose-600 transition"
                                  title="Kategoriyi Sil"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Modals */}
        {editingUser && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Kullanıcı Profilini Düzenle</h2>
                    <p className="text-slate-500 font-medium">{editingUser.user.email}</p>
                  </div>
                  <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-slate-100 rounded-full transition">
                    <XCircle className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const payload = {
                    role: formData.get('role'),
                    isActive: formData.get('isActive') === 'true',
                    profileData: {
                      fullName: formData.get('fullName'),
                      companyName: formData.get('companyName'),
                      phone: formData.get('phone'),
                      address: formData.get('address'),
                    }
                  };
                  await fetch(`/api/admin/users/${editingUser.user.id}/profile`, {
                    method: 'PATCH',
                    headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(payload)
                  });
                  setEditingUser(null);
                  fetchData();
                }} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Rol</label>
                      <select name="role" defaultValue={editingUser.user.role} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500">
                        <option value="buyer">Alıcı (Buyer)</option>
                        <option value="supplier">Tedarikçi (Supplier)</option>
                        <option value="admin">Yönetici (Admin)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Durum</label>
                      <select name="isActive" defaultValue={editingUser.user.isActive.toString()} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500">
                        <option value="true">Aktif</option>
                        <option value="false">Pasif</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Ad Soyad / Firma Yetkilisi</label>
                    <input name="fullName" defaultValue={editingUser.profile?.fullName || editingUser.profile?.companyName} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Telefon</label>
                      <input name="phone" defaultValue={editingUser.profile?.phone} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Firma Adı</label>
                      <input name="companyName" defaultValue={editingUser.profile?.companyName} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Adres</label>
                    <textarea name="address" defaultValue={editingUser.profile?.address} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500 h-24 resize-none" />
                  </div>

                  <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-200">
                    Değişiklikleri Kaydet
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {editingGroupBuy && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">İlanı Düzenle</h2>
                    <p className="text-slate-500 font-medium">{editingGroupBuy.productName}</p>
                  </div>
                  <button onClick={() => setEditingGroupBuy(null)} className="p-2 hover:bg-slate-100 rounded-full transition">
                    <XCircle className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const payload = {
                    ...Object.fromEntries(formData.entries()),
                    unitPrice: parseFloat(formData.get('unitPrice') as string),
                    targetQuantity: parseFloat(formData.get('targetQuantity') as string),
                    imagesBase64: editingImages,
                  };
                  await fetch(`/api/admin/group-buys/${editingGroupBuy.id}`, {
                    method: 'PATCH',
                    headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(payload)
                  });
                  setEditingGroupBuy(null);
                  fetchData();
                }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Ürün Fotoğrafları</label>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      {editingImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group">
                          <img src={img} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setEditingImages(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.multiple = true;
                          input.accept = 'image/*';
                          input.onchange = (e: any) => {
                            const files = e.target.files;
                            if (!files) return;
                            Array.from(files).forEach((file: any) => {
                              const reader = new FileReader();
                              reader.onload = () => {
                                setEditingImages(prev => [...prev, reader.result as string]);
                              };
                              reader.readAsDataURL(file);
                            });
                          };
                          input.click();
                        }}
                        className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition"
                      >
                        <Upload className="w-5 h-5 mb-1" />
                        <span className="text-[8px] font-black uppercase">Yükle</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Ürün Adı</label>
                    <input name="productName" defaultValue={editingGroupBuy.productName} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Birim Fiyat (TL)</label>
                      <input name="unitPrice" type="number" step="0.01" defaultValue={editingGroupBuy.unitPrice} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Hedef Miktar</label>
                      <input name="targetQuantity" type="number" defaultValue={editingGroupBuy.targetQuantity} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Kategori</label>
                      <input name="category" defaultValue={editingGroupBuy.category} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Durum</label>
                      <select name="status" defaultValue={editingGroupBuy.status} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500">
                        <option value="active">Aktif</option>
                        <option value="completed">Tamamlandı</option>
                        <option value="cancelled">İptal Edildi</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-200">
                    İlanı Güncelle
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {messagingUser && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Mesaj Gönder</h2>
                    <p className="text-slate-500 font-medium">{messagingUser.email}</p>
                  </div>
                  <button onClick={() => setMessagingUser(null)} className="p-2 hover:bg-slate-100 rounded-full transition">
                    <XCircle className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const payload = Object.fromEntries(formData.entries());
                  await fetch(`/api/admin/users/${messagingUser.id}/message`, {
                    method: 'POST',
                    headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(payload)
                  });
                  alert('Mesaj gönderildi!');
                  setMessagingUser(null);
                }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Konu</label>
                    <input name="subject" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" placeholder="Örn: Hesap Bilgilendirmesi" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mesajınız</label>
                    <textarea name="message" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500 h-40 resize-none" placeholder="Mesajınızı buraya yazın..." />
                  </div>

                  <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-200">
                    Gönder
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {editingCategory && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Kategoriyi Düzenle</h2>
                    <p className="text-slate-500 font-medium">{editingCategory.name}</p>
                  </div>
                  <button onClick={() => setEditingCategory(null)} className="p-2 hover:bg-slate-100 rounded-full transition">
                    <XCircle className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const payload = Object.fromEntries(formData.entries());
                  
                  const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
                    method: 'PATCH',
                    headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(payload)
                  });

                  if (res.ok) {
                    alert('Kategori güncellendi!');
                    setEditingCategory(null);
                    fetchData();
                  } else {
                    const err = await res.json();
                    alert('Hata: ' + err.message);
                  }
                }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Kategori Adı</label>
                    <input name="name" defaultValue={editingCategory.name} required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Açıklama</label>
                    <textarea name="description" defaultValue={editingCategory.description} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500 h-24 resize-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">İkon (Lucide Adı)</label>
                    <input name="icon" defaultValue={editingCategory.icon} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" placeholder="Örn: Package, ShoppingCart" />
                  </div>

                  <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-200">
                    Güncelle
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-listings" element={<MyListingsPage />} />
        <Route path="/group-buys" element={<GroupBuyPage />} />
        <Route path="/group-buys/create" element={<CreateGroupBuyPage />} />
        <Route path="/group-buys/:id" element={<GroupBuyDetailPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
