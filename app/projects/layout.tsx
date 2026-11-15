import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ChatBot from "@/components/ChatBot/ChatBot";

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <ChatBot />
    </>
  );
}
