import { Button } from "@/src/components/ui/button";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { motion } from "motion/react";

export const CommunitySection = () => {
  return (
    <section id="community" className="py-24 sm:py-32 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
      
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card max-w-5xl mx-auto rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -ml-32 -mb-32" />

          <div className="relative z-10">
            <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-200 rotate-12">
              <DiscordLogoIcon className="w-12 h-12 text-white -rotate-12" />
            </div>

            <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs mb-6 block">Topluluğumuz</span>
            
            <h2 className="text-4xl md:text-7xl font-display font-black text-slate-900 mb-8 leading-tight tracking-tight">
              Minga <span className="text-gradient">Topluluğuna</span> Katılın
            </h2>

            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              Canlı topluluğumuza katılın! Fırsatları paylaşın, birlikte kazanın ve benzer düşünenlerle büyüyün. Hemen aramıza katılın! 🚀
            </p>

            <Button asChild size="lg" className="h-16 px-12 rounded-2xl text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all duration-300 hover:scale-105">
              <a href="https://discord.com/" target="_blank" className="flex items-center gap-3">
                <DiscordLogoIcon className="w-6 h-6" />
                Discord'a Katıl
              </a>
            </Button>
            
            <div className="mt-12 flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-display font-black text-slate-900">10K+</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Üye</div>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center">
                <div className="text-2xl font-display font-black text-slate-900">500+</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Günlük Mesaj</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
