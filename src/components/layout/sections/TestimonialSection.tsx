import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";

const AvatarRoot = Avatar;

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
    userName: "@ayse_tekstil",
    comment:
      "Minga sayesinde kumaş alımlarımızda %20 tasarruf sağladık. Küçük bir işletme olarak büyüklerin fiyatlarına ulaşabilmek harika.",
    rating: 5.0,
  },
  {
    image: "https://i.pravatar.cc/150?u=mehmet",
    name: "Mehmet Demir",
    userName: "@mehmet_elektronik",
    comment:
      "Tedarikçi bulma ve güvenli ödeme süreçleri çok şeffaf. Minga ile işimizi büyütmek çok daha kolaylaştı.",
    rating: 4.8,
  },
  {
    image: "https://i.pravatar.cc/150?u=can",
    name: "Can Özkan",
    userName: "@can_gida",
    comment:
      "Toplu alım gücü gerçekten işe yarıyor. Minga ekibi her adımda destek oluyor, lojistik süreçleri çok başarılı.",
    rating: 4.9,
  },
  {
    image: "https://i.pravatar.cc/150?u=zeynep",
    name: "Zeynep Aksoy",
    userName: "@zeynep_mobilya",
    comment:
      "Platformun kullanımı çok kolay. İlanları takip etmek ve katılmak saniyeler sürüyor. Kesinlikle tavsiye ederim.",
    rating: 5.0,
  },
  {
    image: "https://i.pravatar.cc/150?u=ali",
    name: "Ali Kaya",
    userName: "@ali_insaat",
    comment:
      "İnşaat malzemeleri alımında Minga'yı kullanıyoruz. Hem fiyat avantajı hem de kaliteli tedarikçilerle çalışmak büyük artı.",
    rating: 4.8,
  },
  {
    image: "https://i.pravatar.cc/150?u=fatma",
    name: "Fatma Şahin",
    userName: "@fatma_medikal",
    comment:
      "Medikal sektöründe güven çok önemli. Minga'nın tedarikçi doğrulama süreci bize bu güveni fazlasıyla veriyor.",
    rating: 4.7,
  },
];

export const TestimonialSection = () => {
  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Referanslarımız
        </h2>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Kullanıcılarımız Ne Diyor?
        </h2>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 space-y-4 gap-4">
        {testimonials.map(({ image, name, userName, comment, rating }) => (
          <Card
            key={userName}
            className="break-inside-avoid bg-muted/50 dark:bg-card"
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <AvatarRoot>
                <AvatarImage
                  alt="user avatar"
                  src={image}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback>SV</AvatarFallback>
              </AvatarRoot>

              <div className="flex flex-col">
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription>{userName}</CardDescription>
              </div>
            </CardHeader>

            <CardContent>{comment}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
