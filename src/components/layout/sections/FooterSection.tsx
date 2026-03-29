import { Github, Instagram, Linkedin, Twitter } from "lucide-react";

export const FooterSection = () => {
  return (
    <footer id="footer" className="container py-24 sm:py-32 px-4">
      <div className="glass-card p-12 md:p-20 rounded-[4rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -mr-48 -mt-48" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
          <div className="space-y-8">
            <a href="/" className="font-display font-black text-3xl flex items-center tracking-tighter">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-200">
                <span className="text-white text-xl">M</span>
              </div>
              Minga
            </a>
            <p className="text-slate-500 font-medium leading-relaxed">
              Minga, toplu alım gücünü dijitalleştirerek ticareti herkes için daha karlı ve erişilebilir kılıyor.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Twitter, url: "#" },
                { icon: Instagram, url: "#" },
                { icon: Linkedin, url: "#" },
                { icon: Github, url: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-slate-900 font-display font-black text-lg mb-8 uppercase tracking-widest">Platform</h3>
            <ul className="space-y-4">
              {['İlanlar', 'Tedarikçiler', 'Nasıl Çalışır?', 'Fiyatlandırma'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-500 font-medium hover:text-blue-600 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 font-display font-black text-lg mb-8 uppercase tracking-widest">Şirket</h3>
            <ul className="space-y-4">
              {['Hakkımızda', 'Ekibimiz', 'Kariyer', 'İletişim'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-500 font-medium hover:text-blue-600 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 font-display font-black text-lg mb-8 uppercase tracking-widest">Yasal</h3>
            <ul className="space-y-4">
              {['Kullanım Koşulları', 'Gizlilik Politikası', 'KVKK Aydınlatma', 'Çerez Politikası'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-500 font-medium hover:text-blue-600 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
            &copy; 2024 Minga. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-xs text-slate-400 font-bold uppercase tracking-widest hover:text-blue-600 transition-colors">TR</a>
            <a href="#" className="text-xs text-slate-400 font-bold uppercase tracking-widest hover:text-blue-600 transition-colors">EN</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
