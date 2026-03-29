import { 
  Blocks, 
  LineChart, 
  Sparkles, 
  Wallet,
  ArrowRight
} from "lucide-react";
import { motion } from "motion/react";

interface BenefitsProps {
  icon: any;
  title: string;
  description: string;
  color: string;
}

const benefits: BenefitsProps[] = [
  {
    icon: Blocks,
    title: "Güven İnşa Edin",
    description: "Topluluk temelli alımlarla hem alıcılar hem de tedarikçiler arasında güçlü bir güven bağı oluşturun.",
    color: "blue"
  },
  {
    icon: LineChart,
    title: "Daha Fazla Satış",
    description: "Tedarikçiler için tek seferde büyük hacimli satış yapma imkanı sağlayarak operasyonel maliyetleri düşürün.",
    color: "emerald"
  },
  {
    icon: Wallet,
    title: "Yüksek Tasarruf",
    description: "Alıcılar için toplu alım gücünü kullanarak bireysel alımlara göre çok daha uygun fiyatlara ulaşın.",
    color: "purple"
  },
  {
    icon: Sparkles,
    title: "Pazar Analizi",
    description: "Hangi ürünlerin daha çok talep gördüğünü gerçek zamanlı verilerle takip edin ve stratejinizi belirleyin.",
    color: "orange"
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32 px-4">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs mb-4 block">Avantajlar</span>
          <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-8 leading-tight tracking-tight">
            Başarıya Giden <br />
            <span className="text-gradient">Kısayolunuz</span>
          </h2>
          <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
            Minga, geleneksel ticaretin zorluklarını ortadan kaldırarak herkesin kazandığı bir ekosistem sunar.
          </p>
          <div className="flex items-center gap-4 p-6 glass-card rounded-3xl border-blue-100 bg-blue-50/30">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Hemen Başlayın</h4>
              <p className="text-sm text-slate-500">Ücretsiz kayıt olun ve ilk ilanınızı oluşturun.</p>
            </div>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {benefits.map(({ icon: Icon, title, description, color }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 rounded-[2.5rem] group hover:-translate-y-2 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
                  color === 'blue' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' :
                  color === 'emerald' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' :
                  color === 'purple' ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' :
                  'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'
                }`}>
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-4xl font-display font-black text-slate-100 group-hover:text-slate-200 transition-colors">
                  0{index + 1}
                </span>
              </div>
              <h3 className="text-xl font-display font-black text-slate-900 mb-4">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">
                {description}
              </p>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Daha Fazla</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
