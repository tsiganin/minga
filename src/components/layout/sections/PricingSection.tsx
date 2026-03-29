import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Check } from "lucide-react";

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  title: string;
  popular: PopularPlanType;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const pricingList: PricingProps[] = [
  {
    title: "Alıcı",
    popular: PopularPlanType.NO,
    price: 0,
    description:
      "Bireysel alıcılar ve küçük işletmeler için tamamen ücretsiz.",
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
    popular: PopularPlanType.YES,
    price: 499,
    description:
      "Ürünlerini binlerce alıcıya ulaştırmak isteyen tedarikçiler için.",
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
    popular: PopularPlanType.NO,
    price: 1499,
    description:
      "Büyük ölçekli operasyonlar ve özel entegrasyonlar için.",
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
    <section id="pricing" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Fiyatlandırma
      </h2>

      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Size Uygun Planı Seçin
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Minga'da her bütçeye ve ihtiyaca uygun bir çözüm var. Hemen katılın ve toplu alım gücünden yararlanın.
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingList.map(
          ({ title, popular, price, description, buttonText, benefitList }) => (
            <Card
              key={title}
              className={
                popular === PopularPlanType.YES
                  ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary"
                  : ""
              }
            >
              <CardHeader>
                <CardTitle className="pb-2 flex justify-between">
                  {title}
                  {popular === PopularPlanType.YES && (
                    <Badge
                      variant="secondary"
                      className="text-sm text-primary"
                    >
                      Most popular
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="pb-4">
                  {description}
                </CardDescription>

                <div>
                  <span className="text-3xl font-bold">${price}</span>
                  <span className="text-muted-foreground"> /month</span>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-4 pb-8">
                {benefitList.map((benefit: string) => (
                  <span
                    key={benefit}
                    className="flex"
                  >
                    <Check className="text-primary mr-2" />
                    <h3>{benefit}</h3>
                  </span>
                ))}
              </CardContent>

              <CardFooter>
                <Button
                  variant={
                    popular === PopularPlanType.YES ? "default" : "secondary"
                  }
                  className="w-full"
                >
                  {buttonText}
                </Button>
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
