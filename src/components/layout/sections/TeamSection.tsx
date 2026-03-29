import { Github, Linkedin, Twitter } from "lucide-react";
import { motion } from "motion/react";

interface TeamProps {
  imageUrl: string;
  firstName: string;
  lastName: string;
  positions: string[];
  socialNetworks: SocialNetworkProps[];
}

interface SocialNetworkProps {
  name: string;
  url: string;
}

const teamList: TeamProps[] = [
  {
    imageUrl: "https://i.pravatar.cc/150?u=ozer_team",
    firstName: "Özer",
    lastName: "Başer",
    positions: ["Kurucu", "Ürün Yöneticisi"],
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/" },
      { name: "Twitter", url: "https://twitter.com/" },
    ],
  },
  {
    imageUrl: "https://i.pravatar.cc/150?u=ayse_team",
    firstName: "Ayşe",
    lastName: "Yılmaz",
    positions: ["Operasyon Direktörü"],
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/" },
    ],
  },
  {
    imageUrl: "https://i.pravatar.cc/150?u=mehmet_team",
    firstName: "Mehmet",
    lastName: "Demir",
    positions: ["Teknoloji Lideri"],
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/" },
      { name: "Github", url: "https://github.com/" },
    ],
  },
  {
    imageUrl: "https://i.pravatar.cc/150?u=selin_team",
    firstName: "Selin",
    lastName: "Kaya",
    positions: ["Pazarlama Müdürü"],
    socialNetworks: [
      { name: "Linkedin", url: "https://www.linkedin.com/" },
      { name: "Twitter", url: "https://twitter.com/" },
    ],
  },
];

const socialIcon = (name: string) => {
  switch (name) {
    case "Linkedin": return <Linkedin className="w-4 h-4" />;
    case "Github": return <Github className="w-4 h-4" />;
    case "Twitter": return <Twitter className="w-4 h-4" />;
  }
};

export const TeamSection = () => {
  return (
    <section id="team" className="container py-24 sm:py-32 px-4">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs mb-4 block">Ekibimiz</span>
        <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-8 leading-tight tracking-tight">
          Uzmanlarımızla <span className="text-gradient">Tanışın</span>
        </h2>
        <p className="text-xl text-slate-500 leading-relaxed font-medium">
          Minga'nın arkasındaki tutkulu ekip, ticareti herkes için daha erişilebilir kılmak için çalışıyor.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamList.map(({ imageUrl, firstName, lastName, positions, socialNetworks }, index) => (
          <motion.div
            key={firstName}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <div className="relative overflow-hidden rounded-[3rem] aspect-[4/5] mb-6 shadow-2xl shadow-slate-200">
              <img
                src={imageUrl}
                alt={`${firstName} ${lastName}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                <div className="flex gap-3">
                  {socialNetworks.map(({ name, url }) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
                    >
                      {socialIcon(name)}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-display font-black text-slate-900 mb-1">
                {firstName} <span className="text-blue-600">{lastName}</span>
              </h3>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
                {positions.join(" & ")}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
