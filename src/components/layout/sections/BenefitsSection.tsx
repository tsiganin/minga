import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { 
  Blocks, 
  LineChart, 
  Sparkles, 
  Wallet 
} from "lucide-react";

interface BenefitsProps {
  icon: any;
  title: string;
  description: string;
}

const benefits: BenefitsProps[] = [
  {
    icon: Blocks,
    title: "Güven İnşa Edin",
    description:
      "Topluluk temelli alımlarla hem alıcılar hem de tedarikçiler arasında güçlü bir güven bağı oluşturun.",
  },
  {
    icon: LineChart,
    title: "Daha Fazla Satış",
    description:
      "Tedarikçiler için tek seferde büyük hacimli satış yapma imkanı sağlayarak operasyonel maliyetleri düşürün.",
  },
  {
    icon: Wallet,
    title: "Yüksek Tasarruf",
    description:
      "Alıcılar için toplu alım gücünü kullanarak bireysel alımlara göre çok daha uygun fiyatlara ulaşın.",
  },
  {
    icon: Sparkles,
    title: "Pazar Analizi",
    description:
      "Hangi ürünlerin daha çok talep gördüğünü gerçek zamanlı verilerle takip edin ve stratejinizi belirleyin.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">Avantajlar</h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Başarıya Giden Kısayolunuz
          </h2>

          <p className="text-xl text-muted-foreground mb-8">
            Minga, geleneksel ticaretin zorluklarını ortadan kaldırarak herkesin kazandığı bir ekosistem sunar.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefits.map(({ icon: Icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/card"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Icon className="size-8 mb-6 text-primary" />
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/card:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
