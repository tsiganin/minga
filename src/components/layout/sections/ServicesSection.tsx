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
    title: "Code Optimization",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet unde eveniet.",
    pro: ProService.NO,
  },
  {
    title: "Social Media Integrations",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet unde eveniet.",
    pro: ProService.YES,
  },
  {
    title: "Custom Domain",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet unde eveniet.",
    pro: ProService.NO,
  },
  {
    title: "Cloud Storage",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet unde eveniet.",
    pro: ProService.YES,
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Services
      </h2>

      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Grow Your Business
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        From strategy to implementation, we are here to help you achieve your
        goals.
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
