import * as React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { Menu, Search, User, LogOut, Shield, Bell, Coins } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc, orderBy } from "firebase/firestore";
import { db, auth } from "@/src/firebase";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "/group-buys",
    label: "İlanlar",
  },
  {
    href: "/#features",
    label: "Özellikler",
  },
  {
    href: "/#pricing",
    label: "Fiyatlandırma",
  },
  {
    href: "/#faq",
    label: "SSS",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let unsubscribeNotifications: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
        unsubscribeNotifications = null;
      }

      if (firebaseUser) {
        // Fetch user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({ uid: firebaseUser.uid, ...userDoc.data() });
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }

        // Listen for notifications
        const q = query(
          collection(db, 'notifications'), 
          where('userId', '==', firebaseUser.uid),
          orderBy('createdAt', 'desc')
        );
        unsubscribeNotifications = onSnapshot(q, (snapshot) => {
          setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => {
          const errInfo = {
            error: error instanceof Error ? error.message : String(error),
            operationType: 'get',
            path: 'notifications',
            authInfo: {
              userId: auth.currentUser?.uid,
              email: auth.currentUser?.email
            }
          };
          console.error("Notifications listener error:", JSON.stringify(errInfo));
        });
      } else {
        setUser(null);
        setNotifications([]);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeNotifications) unsubscribeNotifications();
    };
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { isRead: true });
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/group-buys?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full px-4 pt-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-3xl border border-white/20 shadow-2xl shadow-blue-900/5 px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link
              to="/"
              className="font-display font-black text-2xl flex items-center tracking-tighter no-underline text-slate-900"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-200">
                <span className="text-white text-xl">M</span>
              </div>
              Minga
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {routeList.map((route: RouteProps, i) => (
                <Link
                  key={i}
                  to={route.href}
                  className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all no-underline"
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Ürün veya kategori ara..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 outline-none w-64 transition-all focus:w-80"
              />
            </form>

            <div className="h-8 w-px bg-slate-200" />

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-black text-amber-700">{user.points || 0} Puan</span>
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
                      >
                        <div className="p-5 border-b border-slate-50 flex justify-between items-center">
                          <h4 className="font-black text-slate-900">Bildirimler</h4>
                          <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{unreadCount} Yeni</span>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((n) => (
                              <div 
                                key={n.id} 
                                onClick={() => {
                                  markAsRead(n.id);
                                  if (n.link) navigate(n.link);
                                  setShowNotifications(false);
                                }}
                                className={`p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                              >
                                <p className="font-black text-sm text-slate-900 mb-1">{n.title}</p>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{n.message}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">
                                  {n.createdAt?.seconds ? new Date(n.createdAt.seconds * 1000).toLocaleDateString('tr-TR') : '...'}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="p-10 text-center">
                              <p className="text-sm font-bold text-slate-400">Henüz bildiriminiz yok.</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {user.role === 'admin' && (
                  <Link to="/admin" className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <Shield className="h-5 w-5" />
                  </Link>
                )}
                <Link to="/profile" className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                  <User className="h-5 w-5" />
                </Link>
                <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-6 py-3 text-sm font-black text-slate-600 hover:text-blue-600 transition-colors no-underline">
                  Giriş Yap
                </Link>
                <Link to="/register" className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all no-underline">
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>

          {/* mobile toggle */}
          <div className="flex lg:hidden items-center gap-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
                  <Menu className="h-6 w-6 text-slate-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md border-l-0 p-0">
                <div className="h-full flex flex-col p-8">
                  <SheetHeader className="mb-12">
                    <SheetTitle className="text-left font-display font-black text-3xl tracking-tighter flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
                        <span className="text-white text-xl">M</span>
                      </div>
                      Minga
                    </SheetTitle>
                  </SheetHeader>
                  
                  <nav className="flex flex-col gap-2">
                    {routeList.map(({ href, label }) => (
                      <Link
                        key={label}
                        to={href}
                        onClick={() => setIsOpen(false)}
                        className="text-2xl font-black text-slate-900 no-underline py-4 border-b border-slate-50 hover:text-blue-600 transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto space-y-4">
                    {user ? (
                      <>
                        <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-xl font-black text-slate-900 no-underline py-4">
                          <User className="w-6 h-6 text-blue-600" /> Profilim
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-4 text-xl font-black text-red-600 py-4">
                          <LogOut className="w-6 h-6" /> Çıkış Yap
                        </button>
                      </>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-5 text-center font-black text-slate-900 border-2 border-slate-100 rounded-2xl no-underline">
                          Giriş Yap
                        </Link>
                        <Link to="/register" onClick={() => setIsOpen(false)} className="w-full py-5 text-center font-black text-white bg-blue-600 rounded-2xl no-underline shadow-xl shadow-blue-100">
                          Ücretsiz Kayıt Ol
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
