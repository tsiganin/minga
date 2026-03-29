import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Icon } from "lucide-react";
import { 
  Paintbrush, 
  MessageSquare, 
  MousePointer2, 
  Settings, 
  ShieldCheck, 
  Zap 
} from "lucide-react";

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: "MousePointer2",
    title: "Kolay Kullanım",
    description:
      "Saniyeler içinde ilan açın veya mevcut bir gruba katılın. Karmaşık süreçler yok.",
  },
  {
    icon: "Paintbrush",
    title: "Modern Arayüz",
    description:
      "Kullanıcı dostu ve şık tasarımıyla tüm işlemlerinizi keyifle gerçekleştirin.",
  },
  {
    icon: "Zap",
    title: "Hızlı İşlem",
    description:
      "Gerçek zamanlı güncellemeler ve hızlı altyapı ile fırsatları kaçırmayın.",
  },
  {
    icon: "ShieldCheck",
    title: "Güvenli Ödeme",
    description:
      "Tüm ödemeleriniz ve verileriniz en üst düzey güvenlik standartlarıyla korunur.",
  },
  {
    icon: "Settings",
    title: "Esnek Yönetim",
    description:
      "İlanlarınızı kolayca yönetin, katılımcıları takip edin ve süreci kontrol edin.",
  },
  {
    icon: "MessageSquare",
    title: "Canlı Destek",
    description:
      "Herhangi bir sorunuz olduğunda topluluk ve destek ekibimiz her zaman yanınızda.",
  },
];

const iconMap: Record<string, any> = {
  MousePointer2,
  Paintbrush,
  Zap,
  ShieldCheck,
  Settings,
  MessageSquare,
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Özellikler
      </h2>

      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Bizi Farklı Kılan Nedir?
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Minga, toplu alım süreçlerini dijitalleştirerek herkes için erişilebilir ve karlı hale getirir.
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ icon, title, description }) => {
          const IconComponent = iconMap[icon];
          return (
            <Card key={title} className="bg-muted/50 dark:bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <IconComponent className="size-6 text-primary" />
                  </div>
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
