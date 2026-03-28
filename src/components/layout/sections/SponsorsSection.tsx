import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css";
import { 
  Instagram, 
  Twitter, 
  Github, 
  Youtube, 
  Linkedin, 
  Figma 
} from "lucide-react";

interface SponsorProps {
  icon: any;
  name: string;
}

const sponsors: SponsorProps[] = [
  {
    icon: Instagram,
    name: "Instagram",
  },
  {
    icon: Twitter,
    name: "Twitter",
  },
  {
    icon: Github,
    name: "Github",
  },
  {
    icon: Youtube,
    name: "Youtube",
  },
  {
    icon: Linkedin,
    name: "Linkedin",
  },
  {
    icon: Figma,
    name: "Figma",
  },
];

export const SponsorsSection = () => {
  return (
    <section id="sponsors" className="container pt-24 sm:pt-32">
      <h2 className="text-center text-md lg:text-xl font-bold mb-8 text-primary">
        Our Platinum Sponsors
      </h2>

      <div className="mx-auto">
        <Marquee
          className="gap-[3rem]"
          fade={true}
          innerClassName="gap-[3rem]"
          pauseOnHover={true}
        >
          {sponsors.map(({ icon: Icon, name }) => (
            <div
              key={name}
              className="flex items-center gap-1 text-muted-foreground/60"
            >
              <Icon className="size-6 lg:size-10" />
              <h3 className="text-xl  lg:text-2xl font-bold">{name}</h3>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};
