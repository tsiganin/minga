import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
        <div className="text-center space-y-8">
          <Badge variant="outline" className="text-sm py-2">
            <span className="mr-2 text-primary">
              <Badge>New</Badge>
            </span>
            <span> Design is out now! </span>
          </Badge>

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
            <h1>
              Minga ile
              <span className="text-transparent px-2 bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                Toplu Alım
              </span>
              Gücünü Keşfedin
            </h1>
          </div>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            Birlikte alalım, birlikte kazanalım. Minga, alıcıları ve tedarikçileri bir araya getirerek en iyi fiyatlara ulaşmanızı sağlar.
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button className="w-5/6 md:w-1/4 font-bold group/arrow" onClick={() => {
              document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              İlanları İncele
              <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
            </Button>

            <Button
              asChild
              variant="secondary"
              className="w-5/6 md:w-1/4 font-bold"
            >
              <Link to="/register">
                Hemen Kayıt Ol
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative group mt-14">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl"></div>
          <img
            width={1200}
            height={630}
            className="w-full md:w-[1200px] mx-auto rounded-lg relative leading-none flex items-center border border-t-2 border-secondary  border-t-primary/30"
            src="https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1600&auto=format&fit=crop"
            alt="dashboard"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />

          <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-transparent to-background rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};
