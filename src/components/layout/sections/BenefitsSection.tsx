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
    title: "Build Brand Trust",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet unde eveniet.",
  },
  {
    icon: LineChart,
    title: "More Leads",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet unde eveniet.",
  },
  {
    icon: Wallet,
    title: "Higher Conversions",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet unde eveniet.",
  },
  {
    icon: Sparkles,
    title: "Test Marketing Ideas",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet unde eveniet.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">Benefits</h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Shortcut to Success
          </h2>

          <p className="text-xl text-muted-foreground mb-8">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Guia
            repellat officiis ad odit delectus ducimus error eligendi.
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
