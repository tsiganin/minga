import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Package, TrendingUp, Clock, LayoutGrid, Search, Users, Shield, Activity, Trash2, CheckCircle, XCircle, BarChart3, Mail, Edit, Upload, FileSpreadsheet, List, ArrowLeft, Eye, EyeOff, ArrowRight, Plus, Bell, LogOut, Settings, User as UserIcon, Coins, RefreshCw, PlusCircle, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, increment, runTransaction, writeBatch, limit } from 'firebase/firestore';
import { auth, db } from './firebase';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';
import { tr } from 'date-fns/locale';

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

const UNITS = [
  { value: 'adet', label: 'Adet' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'ton', label: 'Ton' },
  { value: 'litre', label: 'Litre' },
  { value: 'm2', label: 'Metrekare (m²)' },
  { value: 'm3', label: 'Metreküp (m³)' },
  { value: 'paket', label: 'Paket' },
  { value: 'koli', label: 'Koli' },
  { value: 'palet', label: 'Palet' },
];

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    providerInfo: any[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Bir şeyler yanlış gitti.";
      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.error.includes('permission-denied')) {
            errorMessage = "Bu işlemi yapmak için yetkiniz bulunmuyor. Lütfen giriş yaptığınızdan veya doğru hesabı kullandığınızdan emin olun.";
          }
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">Hata Oluştu</h2>
            <p className="text-slate-600 mb-8 font-medium">
              {errorMessage}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function formatPrice(price: number | string) {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

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

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          email: firebaseUser.email,
          role: 'buyer',
          points: 0,
          createdAt: serverTimestamp(),
        });
      }
      
      navigate('/');
    } catch (err: any) {
      setError('Google ile giriş yapılamadı.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Check if user doc exists, if not create it (migration)
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        // This shouldn't happen with new users, but for existing ones during migration
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          email: firebaseUser.email,
          role: 'buyer',
          points: 0,
          createdAt: serverTimestamp(),
        });
      }
      
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('E-posta/Şifre girişi şu anda devre dışı. Lütfen Firebase Console üzerinden etkinleştirin veya Google ile giriş yapın.');
      } else {
        setError('Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
      }
      console.error(err);
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

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500 font-bold uppercase tracking-widest text-[10px]">Veya</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-blue-200 transition-all disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Google ile Giriş Yap
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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get referral code from URL
  const queryParams = new URLSearchParams(location.search);
  const referredBy = queryParams.get('ref');

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          email: firebaseUser.email,
          role: 'buyer',
          points: 0,
          createdAt: serverTimestamp(),
        });
      }
      
      navigate('/');
    } catch (err: any) {
      setError('Google ile giriş yapılamadı.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!role) { setError('Lütfen hesap türünüzü seçin.'); return; }
    if (!agreedToTerms || !agreedToPrivacy) {
      setError('Lütfen kullanım koşullarını ve gizlilik politikasını kabul edin.');
      return;
    }
    setError('');
    setLoading(true);

    const f = e.currentTarget;
    const email = (f.elements.namedItem('email') as HTMLInputElement).value;
    const password = (f.elements.namedItem('password') as HTMLInputElement).value;
    const phone = (f.elements.namedItem('phone') as HTMLInputElement).value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userData: any = {
        uid: firebaseUser.uid,
        email,
        phone,
        role,
        points: 0,
        createdAt: serverTimestamp(),
      };

      if (role === 'buyer') {
        userData.fullName = (f.elements.namedItem('fullName') as HTMLInputElement).value;
      } else {
        userData.companyName = (f.elements.namedItem('companyName') as HTMLInputElement).value;
        userData.taxNumber = (f.elements.namedItem('taxNumber') as HTMLInputElement).value;
      }

      // Handle Referral
      if (referredBy) {
        userData.referredBy = referredBy;
        // Give points to the referrer
        try {
          const referrerDoc = await getDoc(doc(db, 'users', referredBy));
          if (referrerDoc.exists()) {
            await updateDoc(doc(db, 'users', referredBy), {
              points: increment(100) // Give 100 points for referral
            });
            // Add notification for referrer
            await addDoc(collection(db, 'notifications'), {
              userId: referredBy,
              title: 'Referans Puanı!',
              message: 'Bir kullanıcı sizin referansınızla üye oldu. 100 puan kazandınız!',
              isRead: false,
              createdAt: serverTimestamp(),
            });
          }
        } catch (err) {
          console.error('Referral error:', err);
        }
      }

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('E-posta/Şifre kaydı şu anda devre dışı. Lütfen Firebase Console üzerinden etkinleştirin veya Google ile giriş yapın.');
      } else {
        setError(err.message);
      }
      console.error(err);
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

                <div className="space-y-3 py-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="text-sm text-slate-600 font-medium leading-relaxed">
                      <Link to="/terms" className="text-blue-600 hover:underline">Kullanım Koşullarını</Link> okudum ve kabul ediyorum.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={agreedToPrivacy}
                      onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="text-sm text-slate-600 font-medium leading-relaxed">
                      <Link to="/privacy" className="text-blue-600 hover:underline">Gizlilik Politikasını</Link> okudum ve kabul ediyorum.
                    </span>
                  </label>
                </div>

                <button type="submit" disabled={loading} className={`w-full py-4 rounded-2xl font-black text-white text-lg transition-all shadow-xl mt-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${role === 'supplier' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}>
                  {loading ? 'Kayıt Yapılıyor...' : 'Hesap Oluştur'}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500 font-bold uppercase tracking-widest text-[10px]">Veya</span>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-blue-200 transition-all disabled:opacity-50"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  Google ile Kayıt Ol
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Oturum açılmamış.');

      await updateDoc(doc(db, 'users', user.uid), profile);
      setMessage('✅ Profiliniz başarıyla güncellendi!');
    } catch (err: any) {
      setMessage('❌ Güncelleme başarısız: ' + err.message);
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

  const isSupplier = profile.role === 'supplier';
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
                  {profile.avatarBase64 ? <img src={profile.avatarBase64} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <span className="text-3xl">📷</span>}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${isSupplier ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                  {isSupplier ? '🏭 Satıcı' : '🛒 Alıcı'}
                </span>
                <p className="text-slate-400 text-sm font-medium truncate">{profile.email}</p>
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
  const [groupBuys, setGroupBuys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'new' | 'popular'>('new');
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for group buys
    const q = query(collection(db, 'groupBuys'), orderBy('createdAt', 'desc'));
    const unsubscribeGB = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroupBuys(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'groupBuys');
    });

    // Listen for user role
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } else {
        setUserRole(null);
      }
    });

    return () => {
      unsubscribeGB();
      unsubscribeAuth();
    };
  }, []);

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

  const currentUser = auth.currentUser;

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
      <motion.div 
        key={gb.id} 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onClick={() => navigate(`/group-buys/${gb.id}`)} 
        className="glass-card rounded-[2.5rem] overflow-hidden group cursor-pointer transition-all duration-500 hover:-translate-y-2"
      >
        {firstImage && (
          <div className="aspect-[16/10] w-full overflow-hidden relative">
            <img src={firstImage} alt={gb.productName} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
                {gb.category || 'Genel'}
              </span>
            </div>
          </div>
        )}
        <div className="p-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest">Aktif Kampanya</span>
            </div>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {daysLeft > 0 ? `${daysLeft} GÜN KALDI` : 'SÜRE DOLDU'}
            </span>
          </div>
          
          <h3 className="text-2xl font-display font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">{gb.productName}</h3>
          
          <div className="flex items-baseline gap-1.5 mb-8">
            <span className="text-3xl font-display font-black text-slate-900 tracking-tight">{gb.unitPrice}₺</span>
            <span className="text-slate-400 font-bold text-sm">/ {gb.unit}</span>
          </div>

          <div className="space-y-6">
            <div className="space-y-2.5">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toplanan Miktar</span>
                <span className="text-blue-600 font-display font-black text-lg">%{Math.min(100, Math.round(progress))}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min(100, progress)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{gb.currentQuantity} {gb.unit}</span>
                <span>Hedef: {gb.targetQuantity} {gb.unit}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-[8px] font-black text-blue-600">
                  +12
                </div>
              </div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">İncele →</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-slate-900 font-sans">
      {!currentUser && <HeroSection />}
      
      <div id="listings" className={`max-w-7xl mx-auto px-6 lg:px-10 py-12 ${currentUser ? 'pt-28' : ''}`}>
        {currentUser && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <motion.div 
              whileHover={{ y: -8 }}
              onClick={() => navigate('/group-buys')}
              className="glass-card rounded-[3rem] p-10 md:p-14 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl shadow-blue-600/30 group-hover:rotate-6 transition-transform">
                  <Search className="text-white w-10 h-10" />
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 mb-6 tracking-tight">İlanları Keşfet</h2>
                <p className="text-slate-500 text-lg md:text-xl font-medium mb-10 leading-relaxed max-w-md">Aktif grup alımlarını inceleyin, toplu alım gücüne hemen ortak olun.</p>
                <div className="flex items-center gap-3 text-blue-600 font-black text-lg group-hover:gap-5 transition-all">
                  <span>Keşfetmeye Başla</span>
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8 }}
              onClick={() => navigate('/group-buys/create')}
              className="glass-card rounded-[3rem] p-10 md:p-14 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl shadow-emerald-600/30 group-hover:rotate-6 transition-transform">
                  <Plus className="text-white w-10 h-10" />
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 mb-6 tracking-tight">İlan Başlat</h2>
                <p className="text-slate-500 text-lg md:text-xl font-medium mb-10 leading-relaxed max-w-md">Kendi ürününüz için grup alımı başlatın, binlerce alıcıya tek seferde ulaşın.</p>
                <div className="flex items-center gap-3 text-emerald-600 font-black text-lg group-hover:gap-5 transition-all">
                  <span>Kampanya Başlat</span>
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <div className="mb-12">
          {!currentUser && (
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

      {!currentUser && (
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
  const currentUser = auth.currentUser;

  useEffect(() => {
    const q = query(collection(db, 'groupBuys'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const searchParams = new URLSearchParams(location.search);
      const filter = searchParams.get('filter');
      const search = searchParams.get('search')?.toLowerCase();
      
      let filteredData = [...data];

      if (search) {
        filteredData = filteredData.filter((gb: any) => 
          gb.productName.toLowerCase().includes(search) || 
          gb.description.toLowerCase().includes(search) ||
          gb.category?.toLowerCase().includes(search)
        );
      }

      if (filter === 'popular') {
        filteredData.sort((a: any, b: any) => (b.currentQuantity / b.targetQuantity) - (a.currentQuantity / a.targetQuantity));
      } else if (filter === 'new') {
        filteredData.sort((a: any, b: any) => {
          const dateB = b.createdAt?.toDate?.() ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
          const dateA = a.createdAt?.toDate?.() ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
          return dateB - dateA;
        });
      }
      
      setGroupBuys(filteredData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'groupBuys');
    });

    return () => unsubscribe();
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
                      <img src={firstImage} alt={gb.productName} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" referrerPolicy="no-referrer" />
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
                    <span className="text-3xl font-black text-slate-900">{formatPrice(gb.unitPrice)}₺</span>
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
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [targetQuantity, setTargetQuantity] = useState<number>(0);
  const [totalTargetPrice, setTotalTargetPrice] = useState<number>(0);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/login');
    });
    fetchCategories();
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    setTotalTargetPrice(unitPrice * targetQuantity);
  }, [unitPrice, targetQuantity]);

  const fetchCategories = async () => {
    try {
      const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

    const user = auth.currentUser;
    if (!user) { setError('Oturum açılmamış.'); setLoading(false); return; }

    const f = e.currentTarget;
    const dateVal = (f.elements.namedItem('deadlineDate') as HTMLInputElement).value;
    const timeVal = (f.elements.namedItem('deadlineTime') as HTMLInputElement).value;
    const categoryName = (f.elements.namedItem('category') as HTMLSelectElement).value;

    const groupBuyData = {
      productName: (f.elements.namedItem('productName') as HTMLInputElement).value,
      description: (f.elements.namedItem('description') as HTMLTextAreaElement).value,
      category: categoryName,
      targetQuantity: parseFloat((f.elements.namedItem('targetQuantity') as HTMLInputElement).value),
      unitPrice: parseFloat((f.elements.namedItem('unitPrice') as HTMLInputElement).value),
      unit: (f.elements.namedItem('unit') as HTMLInputElement).value,
      deadline: new Date(`${dateVal}T${timeVal}`).toISOString(),
      imagesBase64: JSON.stringify(images),
      creatorId: user.uid,
      currentQuantity: 0,
      status: 'active',
      createdAt: serverTimestamp(),
      targetPrice: totalTargetPrice,
    };

    try {
      const docRef = await addDoc(collection(db, 'groupBuys'), groupBuyData);

      // Give points to creator
      await updateDoc(doc(db, 'users', user.uid), {
        points: increment(50) // 50 points for creating a group buy
      });

      // Notify suppliers in the same category
      const suppliersQuery = query(collection(db, 'users'), where('role', '==', 'supplier'), where('sector', '==', categoryName));
      const suppliersSnapshot = await getDocs(suppliersQuery);
      
      const notificationPromises = suppliersSnapshot.docs.map(supplierDoc => {
        return addDoc(collection(db, 'notifications'), {
          userId: supplierDoc.id,
          title: 'Yeni İlan!',
          message: `${categoryName} kategorisinde yeni bir ilan açıldı: ${groupBuyData.productName}`,
          link: `/group-buys/${docRef.id}`,
          isRead: false,
          createdAt: serverTimestamp(),
        });
      });

      await Promise.all(notificationPromises);

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
                    <img src={img} alt={`preview-${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                <select 
                  name="unit" 
                  required 
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:border-blue-500 outline-none transition-all font-bold"
                >
                  {UNITS.map(u => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Hedef Miktar</label>
                <input 
                  name="targetQuantity" 
                  type="number" 
                  step="0.01" 
                  required 
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setTargetQuantity(parseFloat(e.target.value) || 0)}
                  placeholder="1000" 
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:border-blue-500 outline-none transition-all font-bold" 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Birim Fiyat (₺)</label>
                <input 
                  name="unitPrice" 
                  type="number" 
                  step="0.01" 
                  required 
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                  placeholder="150.00" 
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:border-blue-500 outline-none transition-all font-bold" 
                />
              </div>
            </div>

            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Hedef Toplam Ciro</p>
                  <p className="text-3xl font-black text-slate-900">₺{formatPrice(totalTargetPrice)}</p>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <p className="text-[10px] text-blue-500 mt-3 font-bold italic uppercase tracking-wider">* Birim fiyat ve hedef miktar çarpılarak otomatik hesaplanır.</p>
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
  const [categories, setCategories] = useState<any[]>([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const catsSnap = await getDocs(query(collection(db, 'categories'), orderBy('name', 'asc')));
      setCategories(catsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCategories();

    if (!id) return;

    // Listen for group buy detail
    const unsubscribeGB = onSnapshot(doc(db, 'groupBuys', id), (docSnap) => {
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as any;
        if (data.imagesBase64) {
          try {
            data.images = JSON.parse(data.imagesBase64);
          } catch (e) {
            data.images = [];
          }
        }
        setGb(data);
      } else {
        setGb(null);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `groupBuys/${id}`);
    });

    // Listen for user and their order
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser({ uid: user.uid, ...userDoc.data() });
        }

        // Listen for existing order
        const q = query(collection(db, 'orders'), where('userId', '==', user.uid), where('groupBuyId', '==', id));
        const unsubscribeOrder = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const orderDoc = snapshot.docs[0];
            const orderData = { id: orderDoc.id, ...orderDoc.data() } as any;
            setExistingOrder(orderData);
            setQuantity(orderData.quantity);
          } else {
            setExistingOrder(null);
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, 'orders');
        });
        return () => unsubscribeOrder();
      } else {
        setCurrentUser(null);
        setExistingOrder(null);
      }
    });

    return () => {
      unsubscribeGB();
      unsubscribeAuth();
    };
  }, [id]);

  const handleJoin = async () => {
    const user = auth.currentUser;
    if (!user) { navigate('/login'); return; }
    setJoining(true);
    setMessage('');

    try {
      await runTransaction(db, async (transaction) => {
        const gbRef = doc(db, 'groupBuys', id!);
        const gbDoc = await transaction.get(gbRef);
        if (!gbDoc.exists()) throw new Error('İlan bulunamadı.');

        const gbData = gbDoc.data();
        const oldQty = existingOrder ? existingOrder.quantity : 0;
        const newTotalQty = gbData.currentQuantity - oldQty + quantity;

        // Update GroupBuy
        transaction.update(gbRef, { currentQuantity: newTotalQty });

        // Update or Create Order
        if (existingOrder) {
          const orderRef = doc(db, 'orders', existingOrder.id);
          transaction.update(orderRef, { 
            quantity, 
            updatedAt: serverTimestamp() 
          });
        } else {
          const orderRef = doc(collection(db, 'orders'));
          transaction.set(orderRef, {
            userId: user.uid,
            groupBuyId: id,
            quantity,
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      });

      setMessage(existingOrder ? '✅ Siparişiniz başarıyla güncellendi.' : '✅ Başarıyla katıldınız! Siparişiniz oluşturuldu.');
    } catch (err: any) {
      setMessage(`❌ Hata: ${err.message}`);
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  if (!gb) return <div className="min-h-screen flex items-center justify-center">Bulunamadı.</div>;

  const progress = (gb.currentQuantity / gb.targetQuantity) * 100;
  const isOwner = currentUser && gb.creatorId === currentUser.uid;
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
                  <img src={gb.images[activeImage]} alt={gb.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                      <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                  <span className="text-2xl font-black text-slate-900">{formatPrice(gb.unitPrice)}₺</span>
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
              
              <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/10">
                <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-3">Paylaş & Puan Kazan</p>
                <p className="text-sm text-slate-300 font-medium mb-4 leading-relaxed">Bu ilanı arkadaşlarınızla paylaşın, sizin linkinizle üye olan her kişi için 100 puan kazanın!</p>
                <button 
                  onClick={() => {
                    const url = `${window.location.origin}/register?ref=${currentUser?.uid}`;
                    navigator.clipboard.writeText(url);
                    alert('Referans linkiniz kopyalandı!');
                  }}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" /> Linki Kopyala
                </button>
              </div>

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
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setQuantity(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="flex-1 bg-white/10 border-none rounded-xl py-3 px-4 text-center text-xl font-black outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-2xl font-black">+</button>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-slate-400 font-bold">Toplam Tutar</span>
                    <span className="text-3xl font-black">{formatPrice(quantity * gb.unitPrice)}₺</span>
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
                  const unitPrice = parseFloat(formData.get('unitPrice') as string) || 0;
                  const targetQuantity = parseFloat(formData.get('targetQuantity') as string) || 0;
                  const payload = {
                    productName: formData.get('productName'),
                    unitPrice,
                    targetQuantity,
                    unit: formData.get('unit'),
                    category: formData.get('category'),
                    status: formData.get('status'),
                    targetPrice: unitPrice * targetQuantity,
                    imagesBase64: JSON.stringify(editingImages),
                  };
                  try {
                    await updateDoc(doc(db, 'groupBuys', editingGroupBuy.id), payload);
                    setEditingGroupBuy(null);
                  } catch (err) {
                    console.error("Update Error:", err);
                    alert("Güncelleme sırasında bir hata oluştu.");
                  }
                }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Ürün Fotoğrafları</label>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      {editingImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group">
                          <img src={img} alt={`preview-${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                      <input name="unitPrice" type="number" step="0.01" onFocus={(e) => e.target.select()} defaultValue={editingGroupBuy.unitPrice} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Hedef Miktar</label>
                      <input name="targetQuantity" type="number" step="0.01" onFocus={(e) => e.target.select()} defaultValue={editingGroupBuy.targetQuantity} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Birim</label>
                      <select name="unit" defaultValue={editingGroupBuy.unit} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500">
                        {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Kategori</label>
                      <select name="category" defaultValue={editingGroupBuy.category} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500">
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Durum</label>
                    <select name="status" defaultValue={editingGroupBuy.status} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500">
                      <option value="active">Aktif</option>
                      <option value="completed">Tamamlandı</option>
                      <option value="cancelled">İptal Edildi</option>
                    </select>
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
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchMyData = async () => {
    const user = auth.currentUser;
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userRole = userDoc.exists() ? userDoc.data().role : 'buyer';
      setRole(userRole);

      // Fetch categories for the edit modal
      const catsSnap = await getDocs(query(collection(db, 'categories'), orderBy('name', 'asc')));
      setCategories(catsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      if (userRole === 'supplier') {
        const q = query(collection(db, 'groupBuys'), where('creatorId', '==', user.uid));
        const snapshot = await getDocs(q);
        setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const ordersWithGB = await Promise.all(orders.map(async (order: any) => {
          const gbDoc = await getDoc(doc(db, 'groupBuys', order.groupBuyId));
          return { ...order, groupBuy: gbDoc.exists() ? { id: gbDoc.id, ...gbDoc.data() } : null };
        }));
        setItems(ordersWithGB);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchMyData();
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

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
                  const unitPrice = parseFloat(formData.get('unitPrice') as string) || 0;
                  const targetQuantity = parseFloat(formData.get('targetQuantity') as string) || 0;
                  const payload = {
                    productName: formData.get('productName'),
                    unitPrice,
                    targetQuantity,
                    unit: formData.get('unit'),
                    category: formData.get('category'),
                    status: formData.get('status'),
                    targetPrice: unitPrice * targetQuantity,
                    imagesBase64: JSON.stringify(editingImages),
                  };
                  try {
                    await updateDoc(doc(db, 'groupBuys', editingGroupBuy.id), payload);
                    setEditingGroupBuy(null);
                    fetchMyData();
                  } catch (err) {
                    console.error("Update Error:", err);
                    alert("Güncelleme sırasında bir hata oluştu.");
                  }
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
                      <input name="unitPrice" type="number" step="0.01" onFocus={(e) => e.target.select()} defaultValue={editingGroupBuy.unitPrice} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Hedef Miktar</label>
                      <input name="targetQuantity" type="number" step="0.01" onFocus={(e) => e.target.select()} defaultValue={editingGroupBuy.targetQuantity} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Birim</label>
                      <select name="unit" defaultValue={editingGroupBuy.unit} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500">
                        {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Kategori</label>
                      <select name="category" defaultValue={editingGroupBuy.category} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500">
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Durum</label>
                    <select name="status" defaultValue={editingGroupBuy.status} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500">
                      <option value="active">Aktif</option>
                      <option value="completed">Tamamlandı</option>
                      <option value="cancelled">İptal Edildi</option>
                    </select>
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
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [messagingUser, setMessagingUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({ uid: user.uid, ...userData });
          if (userData.role !== 'admin') {
            navigate('/');
          } else {
            fetchData();
          }
        } else {
          navigate('/');
        }
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [activeTab, navigate]);

  const exportUsers = () => {
    const data = users.map(u => ({
      'Email': u.email,
      'Ad Soyad': u.fullName || u.companyName || '-',
      'Rol': u.role,
      'Telefon': u.phone || '-',
      'Puan': u.points || 0,
      'Durum': u.isActive ? 'Aktif' : 'Pasif',
      'Kayıt Tarihi': u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString('tr-TR') : '-'
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kullanıcılar");
    XLSX.writeFile(workbook, "kullanicilar_listesi.xlsx");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const usersSnap = await getDocs(collection(db, 'users')).catch(err => handleFirestoreError(err, OperationType.LIST, 'users'));
        const gbsSnap = await getDocs(collection(db, 'groupBuys')).catch(err => handleFirestoreError(err, OperationType.LIST, 'groupBuys'));
        const ordersSnap = await getDocs(collection(db, 'orders')).catch(err => handleFirestoreError(err, OperationType.LIST, 'orders'));
        const catsSnap = await getDocs(collection(db, 'categories')).catch(err => handleFirestoreError(err, OperationType.LIST, 'categories'));
        
        const usersData = usersSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
        const gbsData = gbsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
        const ordersData = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
        const catsData = catsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

        // Process data for charts (last 14 days)
        const last14Days = eachDayOfInterval({
          start: subDays(new Date(), 13),
          end: new Date()
        });

        const dailyStats = last14Days.map(date => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const dayUsers = usersData.filter(u => {
            const createdAt = u.createdAt?.toDate ? u.createdAt.toDate() : (u.createdAt ? new Date(u.createdAt) : null);
            return createdAt && format(createdAt, 'yyyy-MM-dd') === dateStr;
          }).length;

          const dayOrders = ordersData.filter(o => {
            const createdAt = o.createdAt?.toDate ? o.createdAt.toDate() : (o.createdAt ? new Date(o.createdAt) : null);
            return createdAt && format(createdAt, 'yyyy-MM-dd') === dateStr;
          }).length;

          return {
            date: format(date, 'd MMM', { locale: tr }),
            users: dayUsers,
            orders: dayOrders
          };
        });

        const gbByCategory = catsData.map(cat => {
          const count = gbsData.filter(gb => gb.category === cat.name || gb.category === cat.id).length;
          return { name: cat.name, value: count };
        }).filter(c => c.value > 0);

        // Additional Analytics
        const totalPotentialRevenue = gbsData
          .filter(gb => gb.status === 'active')
          .reduce((sum, gb) => sum + (gb.targetPrice || 0), 0);

        const totalCollectedRevenue = ordersData
          .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

        const topGroupBuys = gbsData
          .map(gb => {
            const orderCount = ordersData.filter(o => o.groupBuyId === gb.id).length;
            const totalQty = ordersData.filter(o => o.groupBuyId === gb.id).reduce((s, o) => s + (o.quantity || 0), 0);
            const progress = gb.targetQuantity > 0 ? (totalQty / gb.targetQuantity) * 100 : 0;
            return { ...gb, orderCount, totalQty, progress };
          })
          .sort((a, b) => b.orderCount - a.orderCount)
          .slice(0, 5);

        const categoryPerformance = catsData.map(cat => {
          const catOrders = ordersData.filter(o => {
            const gb = gbsData.find(g => g.id === o.groupBuyId);
            return gb && (gb.category === cat.name || gb.category === cat.id);
          });
          const revenue = catOrders.reduce((s, o) => s + (o.totalPrice || 0), 0);
          return { name: cat.name, revenue, orders: catOrders.length };
        }).sort((a, b) => b.revenue - a.revenue).filter(c => c.orders > 0);

        setStats({
          totalUsers: usersSnap.size,
          totalGroupBuys: gbsSnap.size,
          activeGroupBuys: gbsSnap.docs.filter(d => d.data().status === 'active').length,
          totalOrders: ordersSnap.size,
          totalPotentialRevenue,
          totalCollectedRevenue,
          dailyStats,
          gbByCategory,
          topGroupBuys,
          categoryPerformance
        });
      } else if (activeTab === 'users') {
        const snapshot = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else if (activeTab === 'group-buys') {
        const snapshot = await getDocs(query(collection(db, 'groupBuys'), orderBy('createdAt', 'desc')));
        setGroupBuys(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else if (activeTab === 'categories') {
        const snapshot = await getDocs(query(collection(db, 'categories'), orderBy('name', 'asc')));
        setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (err) {
      console.error("Admin Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteGroupBuy = async (id: string) => {
    if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
    try {
      await deleteDoc(doc(db, 'groupBuys', id));
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'groupBuys', id), { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
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
        const data: any[] = XLSX.utils.sheet_to_json(ws);
        
        const batch = writeBatch(db);
        data.forEach((cat: any) => {
          const ref = doc(collection(db, 'categories'));
          batch.set(ref, {
            name: cat.name || cat.Kategori || cat.kategori,
            icon: cat.icon || 'Package',
            createdAt: serverTimestamp()
          });
        });
        await batch.commit();
        
        alert('Kategoriler başarıyla yüklendi.');
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Yükleme sırasında bir hata oluştu. Lütfen Excel formatını kontrol edin.');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUser || currentUser.role !== 'admin') return null;

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
            { id: 'overview', label: 'Dashboard', icon: BarChart3 },
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
              {activeTab === 'overview' ? 'Dashboard' : 
               activeTab === 'users' ? 'Kullanıcı Yönetimi' : 
               activeTab === 'categories' ? 'Kategori Yönetimi' :
               'İlan Yönetimi'}
            </h1>
            <p className="text-slate-500 font-medium">Sistemdeki tüm verileri buradan kontrol edebilirsiniz.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData} 
              className={`p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm ${loading ? 'animate-pulse' : ''}`}
              title="Verileri Yenile"
            >
              <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-400 font-bold">Yükleniyor...</div>
        ) : (
          <>
            {activeTab === 'overview' && stats && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Toplam Kullanıcı', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', tab: 'users' },
                    { label: 'Toplam İlan', value: stats.totalGroupBuys, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-100', tab: 'group-buys' },
                    { label: 'Aktif İlanlar', value: stats.activeGroupBuys, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100', tab: 'group-buys' },
                    { label: 'Toplam Sipariş', value: stats.totalOrders, icon: Shield, color: 'text-rose-600', bg: 'bg-rose-100', tab: 'overview' },
                    { label: 'Potansiyel Ciro', value: stats.totalPotentialRevenue.toLocaleString('tr-TR') + ' TL', icon: Coins, color: 'text-amber-600', bg: 'bg-amber-100', tab: 'overview' },
                    { label: 'Toplanan Ciro', value: stats.totalCollectedRevenue.toLocaleString('tr-TR') + ' TL', icon: Coins, color: 'text-orange-600', bg: 'bg-orange-100', tab: 'overview' },
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Daily Activity Chart */}
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Günlük Aktivite (Son 14 Gün)</h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.dailyStats}>
                          <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                          <Tooltip 
                            contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                          />
                          <Area type="monotone" dataKey="users" name="Yeni Kullanıcı" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                          <Area type="monotone" dataKey="orders" name="Yeni Sipariş" stroke="#10b981" fillOpacity={1} fill="url(#colorOrders)" strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Categories Distribution */}
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Kategori Dağılımı (İlan Sayısı)</h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.gbByCategory}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {stats.gbByCategory.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'][index % 6]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ fontWeight: 'bold' }}
                          />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Category Performance Bar Chart */}
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Kategori Performansı (Ciro TL)</h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.categoryPerformance}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Performing Group Buys */}
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-6">En Popüler İlanlar</h3>
                    <div className="space-y-4">
                      {stats.topGroupBuys.map((gb: any) => (
                        <div key={gb.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-white shadow-sm">
                              <img 
                                src={gb.imagesBase64 ? JSON.parse(gb.imagesBase64)[0] : 'https://picsum.photos/seed/product/100/100'} 
                                alt={gb.productName} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-sm line-clamp-1">{gb.productName}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{gb.orderCount} Sipariş</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden mb-1">
                              <div 
                                className="h-full bg-blue-600 transition-all duration-500" 
                                style={{ width: `${Math.min(gb.progress, 100)}%` }}
                              />
                            </div>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">%{Math.round(gb.progress)} Doluluk</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Kullanıcı Listesi</h3>
                    <p className="text-sm text-slate-500 font-medium">Sistemdeki tüm kayıtlı kullanıcıları yönetin.</p>
                  </div>
                  <button 
                    onClick={exportUsers}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                  >
                    <Download className="w-5 h-5" />
                    Excel İndir
                  </button>
                </div>

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
                                  const userDoc = await getDoc(doc(db, 'users', user.id));
                                  if (userDoc.exists()) {
                                    const userData = userDoc.data();
                                    setEditingUser({ user: { id: user.id, ...userData }, profile: userData });
                                  }
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
                        onClick={() => setIsAddingCategory(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
                      >
                        <PlusCircle className="w-5 h-5" />
                        Yeni Kategori
                      </button>
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
                    fullName: formData.get('fullName'),
                    companyName: formData.get('companyName'),
                    phone: formData.get('phone'),
                    address: formData.get('address'),
                  };
                  try {
                    await updateDoc(doc(db, 'users', editingUser.user.id), payload);
                    setEditingUser(null);
                    fetchData();
                  } catch (err) {
                    console.error("User Update Error:", err);
                    alert("Kullanıcı güncellenirken bir hata oluştu.");
                  }
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
                    <input name="fullName" onFocus={(e) => e.target.select()} defaultValue={editingUser.profile?.fullName || editingUser.profile?.companyName} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Telefon</label>
                      <input name="phone" onFocus={(e) => e.target.select()} defaultValue={editingUser.profile?.phone} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Firma Adı</label>
                      <input name="companyName" onFocus={(e) => e.target.select()} defaultValue={editingUser.profile?.companyName} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
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
                  const unitPrice = parseFloat(formData.get('unitPrice') as string) || 0;
                  const targetQuantity = parseFloat(formData.get('targetQuantity') as string) || 0;
                  const payload = {
                    productName: formData.get('productName'),
                    unitPrice,
                    targetQuantity,
                    unit: formData.get('unit'),
                    category: formData.get('category'),
                    status: formData.get('status'),
                    targetPrice: unitPrice * targetQuantity,
                    imagesBase64: JSON.stringify(editingImages),
                  };
                  try {
                    await updateDoc(doc(db, 'groupBuys', editingGroupBuy.id), payload);
                    setEditingGroupBuy(null);
                    fetchData();
                  } catch (err) {
                    console.error("Update Error:", err);
                    alert("Güncelleme sırasında bir hata oluştu.");
                  }
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
                      <input name="unitPrice" type="number" step="0.01" onFocus={(e) => e.target.select()} defaultValue={editingGroupBuy.unitPrice} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Hedef Miktar</label>
                      <input name="targetQuantity" type="number" step="0.01" onFocus={(e) => e.target.select()} defaultValue={editingGroupBuy.targetQuantity} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Birim</label>
                      <select name="unit" defaultValue={editingGroupBuy.unit} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500">
                        {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Kategori</label>
                      <select name="category" defaultValue={editingGroupBuy.category} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500">
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Durum</label>
                    <select name="status" defaultValue={editingGroupBuy.status} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500">
                      <option value="active">Aktif</option>
                      <option value="completed">Tamamlandı</option>
                      <option value="cancelled">İptal Edildi</option>
                    </select>
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
                  try {
                    await addDoc(collection(db, 'notifications'), {
                      userId: messagingUser.id,
                      title: formData.get('subject'),
                      message: formData.get('message'),
                      isRead: false,
                      createdAt: serverTimestamp(),
                    });
                    alert('Mesaj gönderildi!');
                    setMessagingUser(null);
                  } catch (err) {
                    console.error("Message Error:", err);
                    alert("Mesaj gönderilirken bir hata oluştu.");
                  }
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

        {isAddingCategory && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Yeni Kategori Ekle</h2>
                    <p className="text-slate-500 font-medium">Sisteme yeni bir ürün kategorisi tanımlayın.</p>
                  </div>
                  <button onClick={() => setIsAddingCategory(false)} className="p-2 hover:bg-slate-100 rounded-full transition">
                    <XCircle className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const payload = {
                    name: formData.get('name'),
                    description: formData.get('description'),
                    icon: formData.get('icon') || 'Package',
                    createdAt: serverTimestamp(),
                  };
                  try {
                    await addDoc(collection(db, 'categories'), payload);
                    alert('Kategori başarıyla eklendi!');
                    setIsAddingCategory(false);
                    fetchData();
                  } catch (err: any) {
                    console.error(err);
                    alert('Hata: ' + err.message);
                  }
                }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Kategori Adı</label>
                    <input name="name" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" placeholder="Örn: Elektronik" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Açıklama</label>
                    <textarea name="description" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500 h-24 resize-none" placeholder="Kategori hakkında kısa bilgi..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">İkon (Lucide Adı)</label>
                    <input name="icon" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" placeholder="Örn: Package, ShoppingCart, Laptop" />
                  </div>

                  <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition shadow-xl shadow-emerald-200">
                    Kategoriyi Oluştur
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
                  try {
                    await updateDoc(doc(db, 'categories', editingCategory.id), payload);
                    alert('Kategori güncellendi!');
                    setEditingCategory(null);
                    fetchData();
                  } catch (err: any) {
                    console.error(err);
                    alert('Hata: ' + err.message);
                  }
                }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Kategori Adı</label>
                    <input name="name" onFocus={(e) => e.target.select()} defaultValue={editingCategory.name} required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Açıklama</label>
                    <textarea name="description" onFocus={(e) => e.target.select()} defaultValue={editingCategory.description} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500 h-24 resize-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">İkon (Lucide Adı)</label>
                    <input name="icon" onFocus={(e) => e.target.select()} defaultValue={editingCategory.icon} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" placeholder="Örn: Package, ShoppingCart" />
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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user profile from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        let userData = userDoc.exists() ? userDoc.data() : null;

        if (userData) {
          setUser({ ...firebaseUser, ...userData });
        } else {
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
