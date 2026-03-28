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
  { icon: Instagram, name: "Instagram" },
  { icon: Twitter, name: "Twitter" },
  { icon: Github, name: "Github" },
  { icon: Youtube, name: "Youtube" },
  { icon: Linkedin, name: "Linkedin" },
  { icon: Figma, name: "Figma" },
];

export const SponsorsSection = () => {
  const items = [...sponsors, ...sponsors];

  return (
    <section id="sponsors" className="container pt-24 sm:pt-32">
      <h2 className="text-center text-md lg:text-xl font-bold mb-8 text-primary">
        Our Platinum Sponsors
      </h2>

      <div className="mx-auto overflow-hidden relative">
        {/* Sol fade */}
        <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }}
        />
        {/* Sağ fade */}
        <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }}
        />

        <div
          className="flex gap-12 w-max"
          style={{
            animation: "marquee 20s linear infinite",
          }}
          onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
          onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
        >
          {items.map(({ icon: Icon, name }, index) => (
            <div
              key={`${name}-${index}`}
              className="flex items-center gap-1 text-muted-foreground/60"
            >
              <Icon className="size-6 lg:size-10" />
              <h3 className="text-xl lg:text-2xl font-bold">{name}</h3>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};