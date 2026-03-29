import { Separator } from "@/src/components/ui/separator";

export const FooterSection = () => {
  return (
    <footer id="footer" className="container py-24 sm:py-32">
      <div className="p-10 bg-muted/50 dark:bg-card border rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <a
              rel="noreferrer noopener"
              href="/"
              className="font-bold text-2xl flex items-center"
            >
              <span className="bg-primary text-white px-2 py-1 rounded-lg mr-2">M</span>
              Minga
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">İletişim</h3>
            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                E-posta
              </a>
            </div>

            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Telefon
              </a>
            </div>

            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Adres
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Platform</h3>
            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Web
              </a>
            </div>

            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Mobil
              </a>
            </div>

            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Masaüstü
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Yardım</h3>
            <div>
              <a
                rel="noreferrer noopener"
                href="#contact"
                className="opacity-60 hover:opacity-100"
              >
                Bize Ulaşın
              </a>
            </div>

            <div>
              <a
                rel="noreferrer noopener"
                href="#faq"
                className="opacity-60 hover:opacity-100"
              >
                S.S.S
              </a>
            </div>

            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Geri Bildirim
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Sosyal Medya</h3>
            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Twitter
              </a>
            </div>

            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                Instagram
              </a>
            </div>

            <div>
              <a
                rel="noreferrer noopener"
                href="#"
                className="opacity-60 hover:opacity-100"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        <section className="">
          <h3 className="">
            &copy; 2024 Minga. Tüm hakları saklıdır.
          </h3>
        </section>
      </div>
    </footer>
  );
};
