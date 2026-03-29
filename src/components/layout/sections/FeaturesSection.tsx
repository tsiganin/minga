import { 
  Paintbrush, 
  MessageSquare, 
  MousePointer2, 
  Settings, 
  ShieldCheck, 
  Zap 
} from "lucide-react";
import { motion } from "motion/react";

interface FeatureProps {
  icon: any;
  title: string;
  description: string;
  color: string;
}

const features: FeatureProps[] = [
  {
    icon: MousePointer2,
    title: "Kolay Kullanım",
    description: "Saniyeler içinde ilan açın veya mevcut bir gruba katılın. Karmaşık süreçler yok.",
    color: "blue"
  },
  {
    icon: Paintbrush,
    title: "Modern Arayüz",
    description: "Kullanıcı dostu ve şık tasarımıyla tüm işlemlerinizi keyifle gerçekleştirin.",
    color: "emerald"
  },
  {
    icon: Zap,
    title: "Hızlı İşlem",
    description: "Gerçek zamanlı güncellemeler ve hızlı altyapı ile fırsatları kaçırmayın.",
    color: "purple"
  },
  {
    icon: ShieldCheck,
    title: "Güvenli Ödeme",
    description: "Tüm ödemeleriniz ve verileriniz en üst düzey güvenlik standartlarıyla korunur.",
    color: "orange"
  },
  {
    icon: Settings,
    title: "Esnek Yönetim",
    description: "İlanlarınızı kolayca yönetin, katılımcıları takip edin ve süreci kontrol edin.",
    color: "blue"
  },
  {
    icon: MessageSquare,
    title: "Canlı Destek",
    description: "Herhangi bir sorunuz olduğunda topluluk ve destek ekibimiz her zaman yanınızda.",
    color: "emerald"
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32 px-4">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs mb-4 block">Özellikler</span>
        <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-8 leading-tight tracking-tight">
          Bizi Farklı <span className="text-gradient">Kılan Nedir?</span>
        </h2>
        <p className="text-xl text-slate-500 leading-relaxed font-medium">
          Minga, toplu alım süreçlerini dijitalleştirerek herkes için erişilebilir ve karlı hale getirir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ icon: Icon, title, description, color }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-10 rounded-[2.5rem] group hover:-translate-y-2 transition-all duration-500"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg transition-all duration-500 group-hover:rotate-6 ${
              color === 'blue' ? 'bg-blue-600 shadow-blue-200' :
              color === 'emerald' ? 'bg-emerald-600 shadow-emerald-200' :
              color === 'purple' ? 'bg-purple-600 shadow-purple-200' :
              'bg-orange-600 shadow-orange-200'
            }`}>
              <Icon className="text-white w-8 h-8" />
            </div>
            <h3 className="text-2xl font-display font-black text-slate-900 mb-4">{title}</h3>
            <p className="text-slate-500 text-base leading-relaxed font-medium">
              {description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
