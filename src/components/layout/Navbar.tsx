import * as React from "react";
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/src/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";

import { Button, buttonVariants } from "@/src/components/ui/button";
import { Menu, Search, User, LogOut, Shield, Package } from "lucide-react";

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
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/group-buys?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-b-slate-700 dark:bg-background/95">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-16 px-4 w-screen flex justify-between items-center">
          <NavigationMenuItem className="font-bold flex">
            <Link
              to="/"
              className="ml-2 font-black text-2xl flex items-center gap-2 no-underline text-slate-900"
            >
              <div className="bg-blue-600 p-1.5 rounded-xl">
                <Package className="text-white size-6" />
              </div>
              Minga
            </Link>
          </NavigationMenuItem>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <Link
                key={i}
                to={route.href}
                className={`text-[15px] font-bold no-underline ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Ürün ara..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none w-48 transition-all focus:w-64"
              />
            </form>

            {token ? (
              <div className="flex items-center gap-2">
                {userRole === 'admin' && (
                  <Link to="/admin" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                    <Shield className="mr-2 h-4 w-4" />
                    Admin
                  </Link>
                )}
                <Link to="/profile" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                  Giriş Yap
                </Link>
                <Link to="/register" className={buttonVariants({ variant: "default", size: "sm" })}>
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>

          {/* mobile */}
          <span className="flex md:hidden items-center gap-2">
            <Sheet
              open={isOpen}
              onOpenChange={setIsOpen}
            >
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="px-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    Minga-Group Buy
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <Link
                      key={label}
                      to={href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-bold no-underline px-4 py-2 hover:bg-slate-100 rounded-xl transition"
                    >
                      {label}
                    </Link>
                  ))}
                  <hr className="my-2" />
                  {token ? (
                    <>
                      <Link to="/profile" onClick={() => setIsOpen(false)} className="text-lg font-bold no-underline px-4 py-2 hover:bg-slate-100 rounded-xl transition">Profil</Link>
                      {userRole === 'admin' && <Link to="/admin" onClick={() => setIsOpen(false)} className="text-lg font-bold no-underline px-4 py-2 hover:bg-slate-100 rounded-xl transition">Admin</Link>}
                      <Button variant="ghost" onClick={handleLogout} className="justify-start text-lg font-bold text-red-600 px-4">Çıkış Yap</Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg font-bold no-underline px-4 py-2 hover:bg-slate-100 rounded-xl transition">Giriş Yap</Link>
                      <Link to="/register" onClick={() => setIsOpen(false)} className="text-lg font-bold no-underline px-4 py-2 bg-blue-600 text-white rounded-xl transition">Kayıt Ol</Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </span>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
