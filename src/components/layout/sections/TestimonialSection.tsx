import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Star } from "lucide-react";
import { motion } from "motion/react";

interface TestimonialProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
  rating: number;
}

const testimonials: TestimonialProps[] = [
  {
    image: "https://i.pravatar.cc/150?u=ayse",
    name: "Ayşe Yılmaz",
    userName: "Tekstil İşletmecisi",
    comment: "Minga sayesinde kumaş alımlarımızda %20 tasarruf sağladık. Küçük bir işletme olarak büyüklerin fiyatlarına ulaşabilmek harika.",
    rating: 5,
  },
  {
    image: "https://i.pravatar.cc/150?u=mehmet",
    name: "Mehmet Demir",
    userName: "Elektronik Tedarikçisi",
    comment: "Tedarikçi bulma ve güvenli ödeme süreçleri çok şeffaf. Minga ile işimizi büyütmek çok daha kolaylaştı.",
    rating: 5,
  },
  {
    image: "https://i.pravatar.cc/150?u=can",
    name: "Can Özkan",
    userName: "Gıda Toptancısı",
    comment: "Toplu alım gücü gerçekten işe yarıyor. Minga ekibi her adımda destek oluyor, lojistik süreçleri çok başarılı.",
    rating: 5,
  },
  {
    image: "https://i.pravatar.cc/150?u=zeynep",
    name: "Zeynep Aksoy",
    userName: "Mobilya Tasarımcısı",
    comment: "Platformun kullanımı çok kolay. İlanları takip etmek ve katılmak saniyeler sürüyor. Kesinlikle tavsiye ederim.",
    rating: 5,
  },
  {
    image: "https://i.pravatar.cc/150?u=ali",
    name: "Ali Kaya",
    userName: "İnşaat Mühendisi",
    comment: "İnşaat malzemeleri alımında Minga'yı kullanıyoruz. Hem fiyat avantajı hem de kaliteli tedarikçilerle çalışmak büyük artı.",
    rating: 5,
  },
  {
    image: "https://i.pravatar.cc/150?u=fatma",
    name: "Fatma Şahin",
    userName: "Medikal Satın Alma",
    comment: "Medikal sektöründe güven çok önemli. Minga'nın tedarikçi doğrulama süreci bize bu güveni fazlasıyla veriyor.",
    rating: 5,
  },
];

export const TestimonialSection = () => {
  return (
    <section id="testimonials" className="container py-24 sm:py-32 px-4">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs mb-4 block">Referanslarımız</span>
        <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-8 leading-tight tracking-tight">
          Kullanıcılarımız <span className="text-gradient">Ne Diyor?</span>
        </h2>
        <p className="text-xl text-slate-500 leading-relaxed font-medium">
          Binlerce mutlu kullanıcı Minga ile ticaretini büyütüyor ve tasarruf ediyor.
        </p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {testimonials.map(({ image, name, userName, comment, rating }, index) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-8 rounded-[2.5rem] break-inside-avoid group hover:-translate-y-2 transition-all duration-500"
          >
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-14 h-14 border-2 border-white shadow-lg">
                <AvatarImage
                  alt={name}
                  src={image}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar>

              <div>
                <h4 className="font-display font-black text-slate-900">{name}</h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{userName}</p>
              </div>
            </div>

            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-orange-400 fill-orange-400' : 'text-slate-200'}`} />
              ))}
            </div>

            <p className="text-slate-600 text-base leading-relaxed font-medium italic">
              "{comment}"
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
