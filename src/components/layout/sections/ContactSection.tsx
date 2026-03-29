import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/src/components/ui/card";
import { Building2, Clock, Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";

const formSchema = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  email: z.string().email(),
  subject: z.string().min(2).max(255),
  message: z.string(),
});

export const ContactSection = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "Genel Bilgi",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <section id="contact" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="mb-4">
            <h2 className="text-lg text-primary mb-2 tracking-wider">
              İletişim
            </h2>

            <h2 className="text-3xl md:text-4xl font-bold">
              Bizimle Bağlantı Kurun
            </h2>
          </div>
          <p className="mb-8 text-muted-foreground lg:w-5/6">
            Sorularınız, önerileriniz veya iş birliği talepleriniz için bize her zaman ulaşabilirsiniz. Minga ekibi olarak size yardımcı olmaktan mutluluk duyarız.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Building2 className="text-primary" />
              <div>Levent, Büyükdere Cd. No:123, 34394 Şişli/İstanbul</div>
            </div>

            <div className="flex gap-2">
              <Phone className="text-primary" />
              <div>+90 (212) 123 45 67</div>
            </div>

            <div className="flex gap-2">
              <Mail className="text-primary" />
              <div>destek@minga.com</div>
            </div>

            <div className="flex gap-2">
              <Clock className="text-primary" />
              <div>
                Pazartesi - Cuma: 09:00 - 18:00
              </div>
            </div>
          </div>
        </div>

        <Card className="bg-muted/50 dark:bg-card">
          <CardHeader className="text-primary text-2xl"> </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid w-full gap-4"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Adınız</FormLabel>
                        <FormControl>
                          <Input placeholder="Ahmet" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Soyadınız</FormLabel>
                        <FormControl>
                          <Input placeholder="Yılmaz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>E-posta</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="ahmet@ornek.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Konu</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Bir konu seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Genel Bilgi">
                              Genel Bilgi
                            </SelectItem>
                            <SelectItem value="Tedarikçi Başvurusu">
                              Tedarikçi Başvurusu
                            </SelectItem>
                            <SelectItem value="Teknik Destek">
                              Teknik Destek
                            </SelectItem>
                            <SelectItem value="İş Birliği">İş Birliği</SelectItem>
                            <SelectItem value="Diğer">
                              Diğer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mesajınız</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="Mesajınızı buraya yazın..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="mt-4">Mesaj Gönder</Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter></CardFooter>
        </Card>
      </div>
    </section>
  );
};
