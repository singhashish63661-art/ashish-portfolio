import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Education from "@/components/Education/Education";
import Experience from "@/components/Experience/Experience";
import Skills from "@/components/Skills/Skills";
import Certifications from "@/components/Certifications/Certifications";
import Projects from "@/components/Projects/Projects";
import Testimonials from "@/components/Testimonials/Testimonials";
import NotesStrip from "@/components/NotesStrip/NotesStrip";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import ChatBot from "@/components/ChatBot/ChatBot";

export default function Home() {
  return (
    <main
      id="content"
      className="relative min-h-screen overflow-x-hidden scroll-smooth bg-white text-gray-900 dark:bg-zinc-950 dark:text-gray-100"
    >
      <Navbar />
      <Hero />
      <About />
      <Education />
      <Experience />
      <Skills />
      <Certifications />
      <Projects />
      <Testimonials />
      <NotesStrip />
      <Contact />
      <Footer />
      <ChatBot />
    </main>
  );
}
