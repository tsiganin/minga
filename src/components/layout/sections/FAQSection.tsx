import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { motion } from "motion/react";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Minga nedir?",
    answer: "Minga, alıcıları bir araya getirerek toplu alım gücü oluşturan ve bu sayede en iyi fiyatlara ulaşmanızı sağlayan bir platformdur.",
    value: "item-1",
  },
  {
    question: "Nasıl toplu alım yaparım?",
    answer: "Platformdaki aktif ilanları inceleyin, ihtiyacınıza uygun olanı seçin ve 'Katıl' butonuna basarak istediğiniz miktarı belirtin. Hedef miktara ulaşıldığında alım gerçekleşir.",
    value: "item-2",
  },
  {
    question: "Tedarikçiler güvenilir mi?",
    answer: "Evet, Minga üzerindeki tüm tedarikçiler sıkı bir doğrulama sürecinden geçer. Ayrıca kullanıcı yorumları ve puanlamaları ile şeffaf bir sistem sunuyoruz.",
    value: "item-3",
  },
  {
    question: "Ödeme süreci nasıl işler?",
    answer: "Ödemeniz Minga güvencesi altındadır. Ürün size teslim edilene ve onaylayana kadar ödemeniz tedarikçiye aktarılmaz.",
    value: "item-4",
  },
  {
    question: "İptal ve iade koşulları nelerdir?",
    answer: "İlan süresi dolmadan katılımınızı iptal edebilirsiniz. Ürün teslimatından sonraki iade süreçleri ise Minga'nın koruma politikası ve satıcı sözleşmesi çerçevesinde yönetilir.",
    value: "item-5",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="container py-24 sm:py-32 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs mb-4 block">S.S.S</span>
          <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-8 leading-tight tracking-tight">
            Sıkça Sorulan <span className="text-gradient">Sorular</span>
          </h2>
          <p className="text-xl text-slate-500 leading-relaxed font-medium">
            Minga hakkında merak ettiğiniz her şey burada. Başka bir sorunuz mu var? Bize ulaşın.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 rounded-[3rem]"
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {FAQList.map(({ question, answer, value }) => (
              <AccordionItem key={value} value={value} className="border-b border-slate-100 last:border-0">
                <AccordionTrigger className="text-left text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors py-6">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-500 text-base leading-relaxed font-medium pb-6">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
