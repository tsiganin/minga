import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="px-4 py-1.5 mb-8 rounded-full bg-blue-50 text-blue-600 border-blue-100 font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Türkiye'nin İlk Toplu Alım Platformu
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tight text-slate-900 mb-8 leading-[0.9]"
          >
            Minga ile <br />
            <span className="text-blue-600">Toplu Alım</span> <br />
            Gücünü Keşfedin
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-500 mb-12 max-w-2xl leading-relaxed font-medium"
          >
            Birlikte alalım, birlikte kazanalım. Minga, alıcıları ve tedarikçileri bir araya getirerek en iyi fiyatlara ulaşmanızı sağlar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Button 
              size="lg"
              className="w-full sm:w-auto h-14 px-10 rounded-2xl text-lg font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 group"
              onClick={() => {
                document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              İlanları İncele
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-14 px-10 rounded-2xl text-lg font-black border-2 border-slate-200 hover:bg-slate-50"
            >
              <Link to="/register">
                Hemen Kayıt Ol
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 border-t border-slate-100 pt-12 w-full"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-blue-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-2xl font-display font-black tracking-tight">%40'a Varan</span>
              </div>
              <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Tasarruf</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-2xl font-display font-black tracking-tight">Güvenli</span>
              </div>
              <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Ödeme Sistemi</span>
            </div>
            <div className="hidden md:flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-purple-600">
                <Users className="w-5 h-5" />
                <span className="text-2xl font-display font-black tracking-tight">10.000+</span>
              </div>
              <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Aktif Kullanıcı</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 relative px-4"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <div className="glass-card rounded-[3rem] p-4 overflow-hidden shadow-2xl">
            <img
              className="w-full rounded-[2.5rem] object-cover"
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
              alt="Minga Dashboard"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
