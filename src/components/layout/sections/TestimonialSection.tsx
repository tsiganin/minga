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
    image: "https://i.pravatar.cc/150?u=john",
    name: "John Doe",
    userName: "@john_doe",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    rating: 5.0,
  },
  {
    image: "https://i.pravatar.cc/150?u=jane",
    name: "Jane Doe",
    userName: "@jane_doe",
    comment:
      "Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    rating: 4.8,
  },
  {
    image: "https://i.pravatar.cc/150?u=alex",
    name: "Alex Smith",
    userName: "@alex_smith",
    comment:
      "Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    rating: 4.9,
  },
  {
    image: "https://i.pravatar.cc/150?u=caleb",
    name: "Caleb Williams",
    userName: "@caleb_williams",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    rating: 5.0,
  },
  {
    image: "https://i.pravatar.cc/150?u=winona",
    name: "Winona Ryder",
    userName: "@winona_ryder",
    comment:
      "Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    rating: 4.8,
  },
  {
    image: "https://i.pravatar.cc/150?u=paris",
    name: "Paris Hilton",
    userName: "@paris_hilton",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    rating: 4.7,
  },
];

export const TestimonialSection = () => {
  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Testimonials
        </h2>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Hear What Our Customers Say
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
                  crossOrigin="anonymous"
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
