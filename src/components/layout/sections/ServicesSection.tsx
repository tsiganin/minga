import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

enum ProService {
  YES = 1,
  NO = 0,
}

interface ServiceProps {
  title: string;
  description: string;
  pro: ProService;
}

const serviceList: ServiceProps[] = [
  {
    title: "Toplu Alım Yönetimi",
    description:
      "Birden fazla alıcıyı bir araya getirerek ölçek ekonomisinden yararlanmanızı ve en iyi fiyatları almanızı sağlıyoruz.",
    pro: ProService.NO,
  },
  {
    title: "Tedarikçi Doğrulama",
    description:
      "Tüm tedarikçilerimiz sıkı bir denetim sürecinden geçer, böylece güvenli ve kaliteli ürünlere ulaşırsınız.",
    pro: ProService.YES,
  },
  {
    title: "Lojistik Desteği",
    description:
      "Ürünlerin kapınıza kadar güvenle ve en uygun maliyetle ulaşması için lojistik süreçlerini biz yönetiyoruz.",
    pro: ProService.NO,
  },
  {
    title: "Güvenli Ödeme Sistemi",
    description:
      "Ödemeleriniz Minga güvencesi altındadır. Ürün teslim edilene kadar paranız güvenle saklanır.",
    pro: ProService.YES,
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Hizmetlerimiz
      </h2>

      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        İşinizi Birlikte Büyütelim
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Stratejiden uygulamaya kadar, hedeflerinize ulaşmanız için yanınızdayız.
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full lg:w-[60%] mx-auto">
        {serviceList.map(({ title, description, pro }) => (
          <Card
            key={title}
            className="bg-muted/50 dark:bg-card relative"
          >
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            {pro === ProService.YES && (
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-3"
              >
                PRO
              </Badge>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
};
