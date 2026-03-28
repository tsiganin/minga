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
    title: "Customizable",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet unde eveniet.",
  },
  {
    icon: "Paintbrush",
    title: "Beautiful UI",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet unde eveniet.",
  },
  {
    icon: "Zap",
    title: "Fast Performance",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet unde eveniet.",
  },
  {
    icon: "ShieldCheck",
    title: "Secure",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet unde eveniet.",
  },
  {
    icon: "Settings",
    title: "Easy Setup",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet unde eveniet.",
  },
  {
    icon: "MessageSquare",
    title: "Community Support",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet unde eveniet.",
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
        Features
      </h2>

      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        What Makes Us Different
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
        fugiat, odit similique quasi sint reiciendis quidem iure veritatis optio
        facere tenetur.
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
