import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";

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
    answer:
      "Platformdaki aktif ilanları inceleyin, ihtiyacınıza uygun olanı seçin ve 'Katıl' butonuna basarak istediğiniz miktarı belirtin. Hedef miktara ulaşıldığında alım gerçekleşir.",
    value: "item-2",
  },
  {
    question: "Tedarikçiler güvenilir mi?",
    answer:
      "Evet, Minga üzerindeki tüm tedarikçiler sıkı bir doğrulama sürecinden geçer. Ayrıca kullanıcı yorumları ve puanlamaları ile şeffaf bir sistem sunuyoruz.",
    value: "item-3",
  },
  {
    question: "Ödeme süreci nasıl işler?",
    answer:
      "Ödemeniz Minga güvencesi altındadır. Ürün size teslim edilene ve onaylayana kadar ödemeniz tedarikçiye aktarılmaz.",
    value: "item-4",
  },
  {
    question: "İptal ve iade koşulları nelerdir?",
    answer:
      "İlan süresi dolmadan katılımınızı iptal edebilirsiniz. Ürün teslimatından sonraki iade süreçleri ise Minga'nın koruma politikası ve satıcı sözleşmesi çerçevesinde yönetilir.",
    value: "item-5",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="container md:w-[700px] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          S.S.S
        </h2>

        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Sıkça Sorulan Sorular
        </h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
