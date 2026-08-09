import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Code2,
  Mail,
  ExternalLink,
  Linkedin,
  Github,
  GraduationCap,
  Briefcase,
  Target,
  Calendar,
  MapPin,
  Award,
  ChevronRight,
  Loader2,
  Terminal,
  Layers,
  Database,
  MessageSquare,
  Globe,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const LINKEDIN = "http://www.linkedin.com/in/prince-katariya-14225514s";
const GITHUB = "https://github.com/kp8008";
const EMAIL = "princekatariyaprince@gmail.com";

const ASSETS = {
  logo: "/manus-storage/logo-mark_54bcdd5c_6ad406c0.png",
  project1: "/manus-storage/project-showcase-1_5efb051e_6d1b5b18.png",
  project2: "/manus-storage/project-showcase-2_1ace525e_02317114.png",
};

/* ------------------------------------------------------------------ */
/* Scroll reveal hook — adds `in-view` when element enters viewport    */
/* ------------------------------------------------------------------ */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.classList.add("in-view");
            observer.unobserve(el);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`fade-up ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Contact modal                                                      */
/* ------------------------------------------------------------------ */

function ContactModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Message sent!", {
        description: "Thank you — your message has been delivered.",
      });
      onOpenChange(false);
      setName("");
      setEmail("");
      setMessage("");
    },
    onError: error => {
      toast.error("Something went wrong", {
        description: error.message || "Please try again later.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailValid) {
      toast.error("Please enter a valid email address.");
      return;
    }
    submitMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </span>
            Email us directly
          </DialogTitle>
          <DialogDescription className="text-primary underline">{EMAIL}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Your Name</Label>
              <Input
                id="contact-name"
                placeholder="Your Name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Your Email</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-message">Your Message</Label>
            <Textarea
              id="contact-message"
              placeholder="Your Message"
              rows={6}
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={submitMutation.isPending}
            className="w-full text-lg font-semibold"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Sending…
              </>
            ) : (
              <>
                Send <ChevronRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                       */
/* ------------------------------------------------------------------ */

function Logo() {
  return (
    <a href={LINKEDIN} className="flex items-center gap-2 text-xl font-bold text-foreground transition-colors hover:text-primary">
      <img src={ASSETS.logo} alt="Logo" className="h-7 w-7 animate-float" />
      <span>Prince</span>
    </a>
  );
}

function SectionHeading({ title, accent }: { title: string; accent: string }) {
  return (
    <Reveal>
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">{accent}</p>
        <h2 className="mt-1 text-3xl font-extrabold text-foreground md:text-4xl">{title}</h2>
        <div className="mt-3 h-1.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary/30" />
      </div>
    </Reveal>
  );
}

function TechChip({ label, outlined = false }: { label: string; outlined?: boolean }) {
  return (
    <span
      className={
        outlined
          ? "rounded-full border border-primary/40 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          : "rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-transform hover:scale-105"
      }
    >
      {label}
    </span>
  );
}

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
];

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <Button className="rounded-full px-5 text-sm" onClick={() => setContactOpen(true)}>
            <Mail className="mr-2 h-4 w-4" /> Get In Touch
          </Button>
        </div>
      </header>

      {/* Hero — compact, alive with floating shapes and a dot grid */}
      <section className="dot-grid relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary">
        {/* floating decorative shapes */}
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-float" aria-hidden />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent blur-3xl animate-float" style={{ animationDelay: "2s" }} aria-hidden />

        <div className="container relative grid min-h-[68vh] items-center gap-10 py-16 md:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-1.5 text-sm font-medium text-primary shadow-sm">
                <Terminal className="h-4 w-4" /> Available for new opportunities
              </p>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-[3.4rem]">
                Prince Katariya
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-xl font-bold text-primary md:text-2xl">Software Developer</p>
            </Reveal>
            <Reveal delay={180}>
              <p className="max-w-lg text-muted-foreground">
                Full-stack developer passionate about building scalable, real-world
                applications. Experienced in modern web technologies and committed to
                writing clean, maintainable code.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="flex items-center gap-4">
                <Button size="lg" className="rounded-full px-6" onClick={() => setContactOpen(true)}>
                  <Mail className="mr-2 h-4 w-4" /> Contact Me
                </Button>
                <a href={LINKEDIN} target="_blank" rel="noreferrer" className="text-foreground transition-colors hover:text-primary">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href={GITHUB} target="_blank" rel="noreferrer" className="text-foreground transition-colors hover:text-primary">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="hidden lg:block">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/15 to-transparent blur-xl animate-gradient" aria-hidden />
              <div className="relative rounded-2xl border border-border bg-card p-8 shadow-lg animate-float" style={{ animationDelay: "0.5s" }}>
                <Code2 className="h-12 w-12 text-primary" />
                <p className="mt-4 font-semibold text-foreground">Building the future with code</p>
                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  {[
                    { icon: Layers, label: "Full-stack" },
                    { icon: Database, label: "Databases" },
                    { icon: Globe, label: "Web Development" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="rounded-lg bg-secondary/60 p-3">
                      <Icon className="mx-auto h-6 w-6 text-primary" />
                      <p className="mt-1 text-[11px] font-medium text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* About */}
      <section id="about" className="container scroll-mt-20 py-14 md:py-16">
        <SectionHeading accent="Who I am" title="About Me" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I'm a B.Tech Computer Science student at Darshan University, Rajkot
                (CGPA: 7.19), with a passion for building full-stack web applications.
                I have hands-on experience with modern technologies including React,
                ASP.NET Core, and databases like SQL Server and MongoDB.
              </p>
              <p>
                Currently, I'm working as a Software Developer Intern on a real-world
                School ERP system and serving as a Teaching Assistant for ASP.NET Core
                Web API &amp; C# at Darshan University. I'm dedicated to writing clean,
                scalable code and continuously improving my skills.
              </p>
              <p>
                I'm actively seeking opportunities to contribute to impactful projects
                and grow as a developer. Let's build something amazing together!
              </p>
            </div>
          </Reveal>
          <div className="space-y-4">
            {[
              {
                icon: GraduationCap,
                title: "Education",
                text: "B.Tech in Computer Science & Engineering from Darshan University, Rajkot",
              },
              {
                icon: Briefcase,
                title: "Experience",
                text: "Software Developer Intern & Teaching Assistant with hands-on project experience",
              },
              {
                icon: Target,
                title: "Focus",
                text: "Full-stack web development with modern technologies and best practices",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="card-hover rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="container scroll-mt-20 py-14 md:py-16">
        <SectionHeading accent="Where I work" title="Experience" />
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Software Developer Intern",
              company: "School ERP & CMS System | Client Project",
              location: "Rajkot, Gujarat",
              period: "Feb 2025 – Present",
              description:
                "Contributing to real-world CRM platform development similar to Biometric CRM. Currently building a comprehensive school management system covering admissions, staff management, academics, and attendance.",
              bullets: [
                "Contributing to real-world CRM platform development",
                "Building comprehensive school management system with full-stack technologies",
              ],
            },
            {
              title: "Teaching Assistant – ASP.NET Core Web API & C#",
              company: "Darshan University",
              location: "Rajkot, Gujarat",
              period: "Present",
              description:
                "Assisting students in learning ASP.NET Core Web API development and C# programming. Providing guidance on best practices, code reviews, and technical mentoring.",
              bullets: [
                "Mentoring students on ASP.NET Core Web API development",
                "Teaching C# programming fundamentals and advanced concepts",
              ],
            },
          ].map((job, i) => (
            <Reveal key={job.title} delay={i * 100}>
              <div className="card-hover h-full rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold text-foreground">{job.title}</h3>
                <p className="mt-1 font-medium text-primary">{job.company}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{job.period}</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{job.description}</p>
                <ul className="mt-4 space-y-2">
                  {job.bullets.map(b => (
                    <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="container scroll-mt-20 py-14 md:py-16">
        <SectionHeading accent="What I built" title="Featured Projects" />
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card-hover group h-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="overflow-hidden">
                <img
                  src={ASSETS.project1}
                  alt="The Shop Hub – Multi-Product E-Commerce Platform"
                  className="img-zoom h-52 w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground">The Shop Hub – Multi-Product E-Commerce Platform</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  A full-stack e-commerce application with product listings, cart
                  management, and order processing. Built with React frontend and
                  ASP.NET Core backend.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <TechChip label="React" outlined />
                  <TechChip label="ASP.NET Core" outlined />
                  <TechChip label="SQL Server" outlined />
                  <TechChip label="REST APIs" outlined />
                </div>
                <div className="mt-5 flex gap-3">
                  <a href={GITHUB} target="_blank" rel="noreferrer">
                    <Button variant="outline" className="rounded-full bg-transparent"><Github className="mr-2 h-4 w-4" />GitHub</Button>
                  </a>
                  <a href="http://the-shop-hub-ecommerce.vercel.app/" target="_blank" rel="noreferrer">
                    <Button className="rounded-full"><ExternalLink className="mr-2 h-4 w-4" />Live Demo</Button>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="card-hover group h-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="overflow-hidden">
                <img
                  src={ASSETS.project2}
                  alt="Quiz Management System"
                  className="img-zoom h-52 w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground">Quiz Management System</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  A web-based quiz management platform enabling admins to create and
                  manage quizzes. Built with ASP.NET MVC and C#, featuring real-time
                  quiz execution.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <TechChip label="ASP.NET MVC" outlined />
                  <TechChip label="C#" outlined />
                  <TechChip label="SQL Server" outlined />
                  <TechChip label="JavaScript" outlined />
                </div>
                <div className="mt-5 flex gap-3">
                  <a href={GITHUB} target="_blank" rel="noreferrer">
                    <Button variant="outline" className="rounded-full bg-transparent"><Github className="mr-2 h-4 w-4" />GitHub</Button>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="container scroll-mt-20 py-14 md:py-16">
        <SectionHeading accent="My toolbox" title="Skills & Expertise" />
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Technical Skills",
              groups: [
                { label: "LANGUAGES", items: ["C#", "Python", "Java", "JavaScript", "HTML/CSS"] },
                { label: "FRAMEWORKS", items: ["ASP.NET MVC", "ASP.NET Core", "React.js", "Web API", "Node.js"] },
                { label: "DATABASES", items: ["MongoDB", "MySQL", "SQL Server (SSMS)", "PostgreSQL"] },
                { label: "TOOLS", items: ["Git", "Visual Studio", "VS Code", "Postman", "Figma"] },
              ],
            },
            {
              title: "Soft Skills",
              groups: [
                { label: "INTERPERSONAL", items: ["Strong Communication", "Problem Solving", "Teamwork", "Adaptability", "Discipline & Focus"] },
              ],
            },
            {
              title: "Languages",
              groups: [
                { label: "SPOKEN", items: ["Gujarati – Native", "Hindi – Fluent", "English – Fluent"] },
              ],
            },
          ].map((group, i) => (
            <Reveal key={group.title} delay={i * 80}>
              <div className="card-hover h-full rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold text-foreground">{group.title}</h3>
                <div className="mt-5 space-y-5">
                  {group.groups.map(g => (
                    <div key={g.label}>
                      <p className="text-xs font-semibold tracking-wider text-muted-foreground">{g.label}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {g.items.map(item => (
                          <TechChip key={item} label={item} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Education */}
      <section id="education" className="container scroll-mt-20 py-14 md:py-16">
        <SectionHeading accent="Academic path" title="Education" />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "B.Tech – Computer Science & Engineering", school: "Darshan University, Rajkot", detail: "2023-2027 | CGPA: 7.19" },
            { title: "Class 12th – GSHSEB", school: "Shree Gangajal School, Gondal", detail: "2023 | PR: 60" },
            { title: "Class 10th – GSHSEB", school: "Shree Gangajal School, Gondal", detail: "2021 | PR: 99.68" },
          ].map((edu, i) => (
            <Reveal key={edu.title} delay={i * 80}>
              <div className="card-hover h-full rounded-xl border border-border bg-card p-6 shadow-sm">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Award className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-foreground">{edu.title}</h3>
                <p className="mt-1 text-sm font-medium text-primary">{edu.school}</p>
                <p className="mt-2 text-sm text-muted-foreground">{edu.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="dot-grid relative overflow-hidden py-14 md:py-16">
        <div className="container">
          <Reveal>
            <div className="card-hover rounded-2xl border border-border bg-card p-8 text-center shadow-md md:p-10">
              <h2 className="text-3xl font-extrabold text-foreground">Let's Work Together</h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                I'm always interested in hearing about new projects and opportunities.
                Whether you have a question or just want to say hello, feel free to
                reach out!
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="rounded-full px-8" onClick={() => setContactOpen(true)}>
                  <Mail className="mr-2 h-4 w-4" /> Send Email
                </Button>
                <a href={LINKEDIN} target="_blank" rel="noreferrer">
                  <Button size="lg" variant="outline" className="rounded-full bg-transparent px-8">
                    <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                  </Button>
                </a>
                <Button size="lg" variant="outline" className="rounded-full bg-transparent px-8"><span className="mr-2 inline-flex" aria-hidden><svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></span>WhatsApp</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2026 Prince Katariya. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href={GITHUB} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"><Github className="h-4 w-4" />GitHub</a>
            <a href={LINKEDIN} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"><Linkedin className="h-4 w-4" />LinkedIn</a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"><Mail className="h-4 w-4" />Email</a>
          </div>
        </div>
      </footer>

      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  );
}
