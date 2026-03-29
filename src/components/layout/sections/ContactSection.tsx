import { Building2, Clock, Mail, Phone, Send } from "lucide-react";
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
import { motion } from "motion/react";

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
    <section id="contact" className="container py-24 sm:py-32 px-4">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs mb-4 block">İletişim</span>
          <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-8 leading-tight tracking-tight">
            Bizimle <span className="text-gradient">Bağlantı Kurun</span>
          </h2>
          <p className="text-xl text-slate-500 mb-12 leading-relaxed font-medium">
            Sorularınız, önerileriniz veya iş birliği talepleriniz için bize her zaman ulaşabilirsiniz. Minga ekibi olarak size yardımcı olmaktan mutluluk duyarız.
          </p>

          <div className="space-y-8">
            {[
              { icon: Building2, text: "Levent, Büyükdere Cd. No:123, 34394 Şişli/İstanbul", label: "Adres" },
              { icon: Phone, text: "+90 (212) 123 45 67", label: "Telefon" },
              { icon: Mail, text: "destek@minga.com", label: "E-posta" },
              { icon: Clock, text: "Pazartesi - Cuma: 09:00 - 18:00", label: "Çalışma Saatleri" },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <item.icon className="w-6 h-6 text-blue-600 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-slate-900 font-bold">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 rounded-[3rem]"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900 font-bold">Adınız</FormLabel>
                      <FormControl>
                        <Input placeholder="Ahmet" {...field} className="h-14 rounded-xl border-slate-200 bg-white/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900 font-bold">Soyadınız</FormLabel>
                      <FormControl>
                        <Input placeholder="Yılmaz" {...field} className="h-14 rounded-xl border-slate-200 bg-white/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900 font-bold">E-posta</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="ahmet@ornek.com" {...field} className="h-14 rounded-xl border-slate-200 bg-white/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900 font-bold">Konu</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 rounded-xl border-slate-200 bg-white/50">
                            <SelectValue placeholder="Bir konu seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Genel Bilgi">Genel Bilgi</SelectItem>
                          <SelectItem value="Tedarikçi Başvurusu">Tedarikçi Başvurusu</SelectItem>
                          <SelectItem value="Teknik Destek">Teknik Destek</SelectItem>
                          <SelectItem value="İş Birliği">İş Birliği</SelectItem>
                          <SelectItem value="Diğer">Diğer</SelectItem>
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
                    <FormLabel className="text-slate-900 font-bold">Mesajınız</FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder="Mesajınızı buraya yazın..." className="rounded-xl border-slate-200 bg-white/50 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button size="lg" className="w-full h-16 rounded-2xl text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all duration-300">
                <Send className="w-5 h-5 mr-2" />
                Mesaj Gönder
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
};
