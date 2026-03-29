import { Badge } from "@/src/components/ui/badge";
import { CheckCircle2, ShieldCheck, Truck, Users } from "lucide-react";
import { motion } from "motion/react";

interface ServiceProps {
  title: string;
  description: string;
  icon: any;
  pro?: boolean;
}

const serviceList: ServiceProps[] = [
  {
    title: "Toplu Alım Yönetimi",
    description: "Birden fazla alıcıyı bir araya getirerek ölçek ekonomisinden yararlanmanızı ve en iyi fiyatları almanızı sağlıyoruz.",
    icon: Users,
  },
  {
    title: "Tedarikçi Doğrulama",
    description: "Tüm tedarikçilerimiz sıkı bir denetim sürecinden geçer, böylece güvenli ve kaliteli ürünlere ulaşırsınız.",
    icon: ShieldCheck,
    pro: true,
  },
  {
    title: "Lojistik Desteği",
    description: "Ürünlerin kapınıza kadar güvenle ve en uygun maliyetle ulaşması için lojistik süreçlerini biz yönetiyoruz.",
    icon: Truck,
  },
  {
    title: "Güvenli Ödeme Sistemi",
    description: "Ödemeleriniz Minga güvencesi altındadır. Ürün teslim edilene kadar paranız güvenle saklanır.",
    icon: CheckCircle2,
    pro: true,
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="container py-24 sm:py-32 px-4">
      <div className="flex flex-col md:flex-row gap-16 items-center">
        <div className="md:w-1/2">
          <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs mb-4 block">Hizmetlerimiz</span>
          <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-8 leading-tight tracking-tight">
            İşinizi <span className="text-gradient">Birlikte Büyütelim</span>
          </h2>
          <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
            Stratejiden uygulamaya kadar, hedeflerinize ulaşmanız için yanınızdayız. Minga ile ticaret artık daha kolay ve karlı.
          </p>
          <div className="space-y-4">
            {['Hızlı Onay Süreci', 'Düşük Komisyon Oranları', '7/24 Destek'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-bold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-1/2 grid sm:grid-cols-2 gap-6 w-full">
          {serviceList.map(({ title, description, icon: Icon, pro }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 rounded-[2.5rem] relative group hover:bg-blue-600 transition-colors duration-500"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                <Icon className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-display font-black text-slate-900 mb-4 group-hover:text-white transition-colors">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium group-hover:text-blue-50 transition-colors">
                {description}
              </p>
              {pro && (
                <Badge className="absolute top-6 right-6 bg-blue-600 text-white border-none group-hover:bg-white group-hover:text-blue-600">
                  PRO
                </Badge>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
