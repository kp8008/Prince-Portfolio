import { useState } from "react";
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
    <a href={LINKEDIN} className="flex items-center gap-2 text-xl font-bold text-foreground">
      <img src={ASSETS.logo} alt="Logo" className="h-7 w-7" />
      <span>Prince</span>
    </a>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="text-3xl font-extrabold text-foreground md:text-4xl">{title}</h2>
  );
}

function TechChip({ label, outlined = false }: { label: string; outlined?: boolean }) {
  return (
    <span
      className={
        outlined
          ? "rounded-full border border-primary/40 px-3 py-1 text-xs font-medium text-primary"
          : "rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
      }
    >
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground">About</a>
            <a href="#experience" className="text-sm font-medium text-muted-foreground hover:text-foreground">Experience</a>
            <a href="#projects" className="text-sm font-medium text-muted-foreground hover:text-foreground">Projects</a>
            <a href="#skills" className="text-sm font-medium text-muted-foreground hover:text-foreground">Skills</a>
          </nav>
          <Button className="rounded-full px-5" onClick={() => setContactOpen(true)}>
            <Mail className="mr-2 h-4 w-4" /> Get In Touch
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary">
        <div className="container grid min-h-[80vh] items-center gap-12 py-20 lg:grid-cols-2">
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight text-foreground md:text-6xl">
              Prince Katariya
            </h1>
            <p className="text-2xl font-bold text-primary">Software Developer</p>
            <p className="max-w-lg text-muted-foreground">
              Full-stack developer passionate about building scalable, real-world
              applications. Experienced in modern web technologies and committed to
              writing clean, maintainable code.
            </p>
            <div className="flex items-center gap-4">
              <Button size="lg" className="rounded-full px-6" onClick={() => setContactOpen(true)}>
                <Mail className="mr-2 h-4 w-4" /> Contact Me
              </Button>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" className="text-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href={GITHUB} target="_blank" rel="noreferrer" className="text-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl border border-border bg-card p-10 shadow-sm">
              <Code2 className="h-12 w-12 text-primary" />
              <p className="mt-4 font-medium text-foreground">Building the future with code</p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="container scroll-mt-20 py-20">
        <SectionHeading title="About Me" />
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-5 text-muted-foreground leading-relaxed">
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
            ].map(item => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <item.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="container scroll-mt-20 py-20">
        <SectionHeading title="Experience" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
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
          ].map(job => (
            <div key={job.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
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
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="container scroll-mt-20 py-20">
        <SectionHeading title="Featured Projects" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <img src={ASSETS.project1} alt="The Shop Hub – Multi-Product E-Commerce Platform" className="h-52 w-full object-cover" />
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
                  <Button variant="outline" className="rounded-full"><Github className="mr-2 h-4 w-4" />GitHub</Button>
                </a>
                <a href="http://the-shop-hub-ecommerce.vercel.app/" target="_blank" rel="noreferrer">
                  <Button className="rounded-full"><ExternalLink className="mr-2 h-4 w-4" />Live Demo</Button>
                </a>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <img src={ASSETS.project2} alt="Quiz Management System" className="h-52 w-full object-cover" />
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
                  <Button variant="outline" className="rounded-full"><Github className="mr-2 h-4 w-4" />GitHub</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="container scroll-mt-20 py-20">
        <SectionHeading title="Skills & Expertise" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
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
          ].map(group => (
            <div key={group.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
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
          ))}
        </div>
      </section>

      {/* Education */}
      <section id="education" className="container scroll-mt-20 py-20">
        <SectionHeading title="Education" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { title: "B.Tech – Computer Science & Engineering", school: "Darshan University, Rajkot", detail: "2023-2027 | CGPA: 7.19" },
            { title: "Class 12th – GSEB", school: "Shree Gangajal School, Gondal", detail: "2023 | PR: 60" },
            { title: "Class 10th – GSEB", school: "Shree Gangajal School, Gondal", detail: "2021 | PR: 99.68" },
          ].map(edu => (
            <div key={edu.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <Award className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-base font-bold text-foreground">{edu.title}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{edu.school}</p>
              <p className="mt-2 text-sm text-muted-foreground">{edu.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="container scroll-mt-20 py-20">
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
          <h2 className="text-3xl font-extrabold text-foreground">Let's Work Together</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            I'm always interested in hearing about new projects and opportunities.
            Whether you have a question or just want to say hello, feel free to
            reach out!
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="rounded-full px-8" onClick={() => setContactOpen(true)}>
              <Mail className="mr-2 h-4 w-4" /> Send Email
            </Button>
            <a href={LINKEDIN} target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="rounded-full bg-transparent px-8">
                <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
              </Button>
            </a>
            <Button size="lg" variant="outline" className="rounded-full bg-transparent px-8">WhatsApp</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2026 Prince Katariya. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href={GITHUB} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><Github className="h-4 w-4" />GitHub</a>
            <a href={LINKEDIN} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><Linkedin className="h-4 w-4" />LinkedIn</a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><Mail className="h-4 w-4" />Email</a>
          </div>
        </div>
      </footer>

      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  );
}
