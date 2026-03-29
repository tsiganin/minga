import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/src/components/ui/card";
import { Github, Linkedin, Twitter } from "lucide-react";

interface TeamProps {
  imageUrl: string;
  firstName: string;
  lastName: string;
  positions: string[];
  socialNetworks: SocialNetworkProps[];
}

interface SocialNetworkProps {
  name: string;
  url: string;
}

const teamList: TeamProps[] = [
  {
    imageUrl: "https://i.pravatar.cc/150?u=ozer_team",
    firstName: "Özer",
    lastName: "Başer",
    positions: ["Kurucu", "Ürün Yöneticisi"],
    socialNetworks: [
      {
        name: "Linkedin",
        url: "https://www.linkedin.com/",
      },
      {
        name: "Twitter",
        url: "https://twitter.com/",
      },
    ],
  },
  {
    imageUrl: "https://i.pravatar.cc/150?u=ayse_team",
    firstName: "Ayşe",
    lastName: "Yılmaz",
    positions: ["Operasyon Direktörü", "Tedarik Zinciri Uzmanı"],
    socialNetworks: [
      {
        name: "Linkedin",
        url: "https://www.linkedin.com/",
      },
    ],
  },
  {
    imageUrl: "https://i.pravatar.cc/150?u=mehmet_team",
    firstName: "Mehmet",
    lastName: "Demir",
    positions: ["Teknoloji Lideri", "Yazılım Mimarı"],
    socialNetworks: [
      {
        name: "Linkedin",
        url: "https://www.linkedin.com/",
      },
      {
        name: "Github",
        url: "https://github.com/",
      },
    ],
  },
  {
    imageUrl: "https://i.pravatar.cc/150?u=selin_team",
    firstName: "Selin",
    lastName: "Kaya",
    positions: ["Pazarlama Müdürü", "Topluluk Yöneticisi"],
    socialNetworks: [
      {
        name: "Linkedin",
        url: "https://www.linkedin.com/",
      },
      {
        name: "Twitter",
        url: "https://twitter.com/",
      },
    ],
  },
];

const socialIcon = (name: string) => {
  switch (name) {
    case "Linkedin":
      return <Linkedin className="size-5" />;
    case "Github":
      return <Github className="size-5" />;
    case "Twitter":
      return <Twitter className="size-5" />;
  }
};

export const TeamSection = () => {
  return (
    <section id="team" className="container py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Ekibimiz
        </h2>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Uzmanlarımızla Tanışın
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamList.map(
          ({ imageUrl, firstName, lastName, positions, socialNetworks }) => (
            <Card
              key={firstName}
              className="bg-muted/50 dark:bg-card flex flex-col h-full overflow-hidden group/hover"
            >
              <CardHeader className="p-0 gap-0">
                <div className="h-full overflow-hidden">
                  <img
                    src={imageUrl}
                    alt=""
                    className="w-full aspect-square object-cover transition-all duration-200 group-hover/hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <CardTitle className="py-6 pb-4 px-6">
                  {firstName}
                  <span className="text-primary ml-2">{lastName}</span>
                </CardTitle>
              </CardHeader>

              {positions.map((position, index) => (
                <CardContent
                  key={index}
                  className={`pb-0 text-muted-foreground px-6 ${
                    index === positions.length - 1 && "pb-6"
                  }`}
                >
                  {position}
                  {index < positions.length - 1 && ","}
                </CardContent>
              ))}

              <CardFooter className="space-x-4 mt-auto px-6 pb-6">
                {socialNetworks.map(({ name, url }) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    className="hover:opacity-80 transition-all"
                  >
                    {socialIcon(name)}
                  </a>
                ))}
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
