import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "motion/react";

interface PricingProps {
  title: string;
  popular: boolean;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const pricingList: PricingProps[] = [
  {
    title: "Alıcı",
    popular: false,
    price: 0,
    description: "Bireysel alıcılar ve küçük işletmeler için tamamen ücretsiz.",
    buttonText: "Hemen Başla",
    benefitList: [
      "Sınırsız ilana katılım",
      "Güvenli ödeme sistemi",
      "Tedarikçi puanlama",
      "Topluluk desteği",
      "Lojistik takibi",
    ],
  },
  {
    title: "Tedarikçi",
    popular: true,
    price: 499,
    description: "Ürünlerini binlerce alıcıya ulaştırmak isteyen tedarikçiler için.",
    buttonText: "Tedarikçi Ol",
    benefitList: [
      "Sınırsız ilan oluşturma",
      "Doğrulanmış rozeti",
      "Öncelikli listeleme",
      "Detaylı satış analiti",
      "7/24 Destek",
    ],
  },
  {
    title: "Kurumsal",
    popular: false,
    price: 1499,
    description: "Büyük ölçekli operasyonlar ve özel entegrasyonlar için.",
    buttonText: "Bize Ulaşın",
    benefitList: [
      "Özel API erişimi",
      "Kurumsal hesap yönetimi",
      "Özel lojistik çözümleri",
      "Gelişmiş raporlama",
      "SLA garantisi",
    ],
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="container py-24 sm:py-32 px-4">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs mb-4 block">Fiyatlandırma</span>
        <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-8 leading-tight tracking-tight">
          Size Uygun <span className="text-gradient">Planı Seçin</span>
        </h2>
        <p className="text-xl text-slate-500 leading-relaxed font-medium">
          Minga'da her bütçeye ve ihtiyaca uygun bir çözüm var. Hemen katılın ve toplu alım gücünden yararlanın.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingList.map(({ title, popular, price, description, buttonText, benefitList }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card p-10 rounded-[3rem] relative flex flex-col ${
              popular ? 'border-2 border-blue-600 shadow-2xl shadow-blue-200 scale-105 z-10' : ''
            }`}
          >
            {popular && (
              <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1 rounded-full text-sm font-bold border-none">
                EN POPÜLER
              </Badge>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-display font-black text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{description}</p>
            </div>

            <div className="mb-8">
              <span className="text-5xl font-display font-black text-slate-900">₺{price}</span>
              <span className="text-slate-400 font-bold ml-2">/ay</span>
            </div>

            <div className="space-y-4 mb-10 flex-grow">
              {benefitList.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-slate-600 text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <Button
              variant={popular ? "default" : "outline"}
              className={`w-full h-14 rounded-2xl font-bold text-base transition-all duration-300 ${
                popular 
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200' 
                  : 'border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600'
              }`}
            >
              {buttonText}
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
