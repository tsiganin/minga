import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Check } from "lucide-react";

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  title: string;
  popular: PopularPlanType;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const pricingList: PricingProps[] = [
  {
    title: "Free",
    popular: PopularPlanType.NO,
    price: 0,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit nihil.",
    buttonText: "Get Started",
    benefitList: [
      "1 Team member",
      "2 GB Storage",
      "Upto 4 pages",
      "Community support",
      "lorem ipsum dolor",
    ],
  },
  {
    title: "Premium",
    popular: PopularPlanType.YES,
    price: 45,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit nihil.",
    buttonText: "Start Free Trial",
    benefitList: [
      "4 Team member",
      "4 GB Storage",
      "Upto 6 pages",
      "Priority support",
      "lorem ipsum dolor",
    ],
  },
  {
    title: "Enterprise",
    popular: PopularPlanType.NO,
    price: 120,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit nihil.",
    buttonText: "Contact Us",
    benefitList: [
      "10 Team member",
      "8 GB Storage",
      "Upto 10 pages",
      "Priority support",
      "lorem ipsum dolor",
    ],
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Pricing
      </h2>

      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Get Unlimted Access
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
        fugiat, odit similique quasi sint reiciendis quidem iure veritatis optio
        facere tenetur.
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingList.map(
          ({ title, popular, price, description, buttonText, benefitList }) => (
            <Card
              key={title}
              className={
                popular === PopularPlanType.YES
                  ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary"
                  : ""
              }
            >
              <CardHeader>
                <CardTitle className="pb-2 flex justify-between">
                  {title}
                  {popular === PopularPlanType.YES && (
                    <Badge
                      variant="secondary"
                      className="text-sm text-primary"
                    >
                      Most popular
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="pb-4">
                  {description}
                </CardDescription>

                <div>
                  <span className="text-3xl font-bold">${price}</span>
                  <span className="text-muted-foreground"> /month</span>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-4 pb-8">
                {benefitList.map((benefit: string) => (
                  <span
                    key={benefit}
                    className="flex"
                  >
                    <Check className="text-primary mr-2" />
                    <h3>{benefit}</h3>
                  </span>
                ))}
              </CardContent>

              <CardFooter>
                <Button
                  variant={
                    popular === PopularPlanType.YES ? "default" : "secondary"
                  }
                  className="w-full"
                >
                  {buttonText}
                </Button>
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
