import { 
  Instagram, 
  Twitter, 
  Github, 
  Youtube, 
  Linkedin, 
  Figma 
} from "lucide-react";
import { motion } from "motion/react";

interface SponsorProps {
  icon: any;
  name: string;
}

const sponsors: SponsorProps[] = [
  { icon: Instagram, name: "Instagram" },
  { icon: Twitter, name: "Twitter" },
  { icon: Github, name: "Github" },
  { icon: Youtube, name: "Youtube" },
  { icon: Linkedin, name: "Linkedin" },
  { icon: Figma, name: "Figma" },
];

export const SponsorsSection = () => {
  const items = [...sponsors, ...sponsors, ...sponsors];

  return (
    <section id="sponsors" className="py-24 overflow-hidden border-y border-slate-100 bg-slate-50/50">
      <div className="container px-4 mx-auto mb-12">
        <div className="flex flex-col items-center text-center">
          <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Ekosistemimiz</span>
          <h2 className="text-2xl md:text-3xl font-display font-black text-slate-900">
            Güçlü İş Ortaklarımız
          </h2>
        </div>
      </div>

      <div className="relative group">
        {/* Gradients for smooth fade */}
        <div className="absolute left-0 top-0 h-full w-32 md:w-64 z-10 pointer-events-none bg-gradient-to-r from-slate-50/50 to-transparent" />
        <div className="absolute right-0 top-0 h-full w-32 md:w-64 z-10 pointer-events-none bg-gradient-to-l from-slate-50/50 to-transparent" />

        <div className="flex gap-16 md:gap-32 w-max animate-marquee hover:pause">
          {items.map(({ icon: Icon, name }, index) => (
            <div
              key={`${name}-${index}`}
              className="flex items-center gap-4 text-slate-400 hover:text-blue-600 transition-colors duration-300 grayscale hover:grayscale-0"
            >
              <Icon className="w-8 h-8 md:w-12 md:h-12" />
              <span className="text-xl md:text-3xl font-display font-black tracking-tight">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};
