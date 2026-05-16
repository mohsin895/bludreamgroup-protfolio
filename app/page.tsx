import About from "@/components/About";
import Books from "@/components/Books";
import Event from "@/components/Event";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Testimonial from "@/components/Testimonial";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Books />

      <Testimonial />

      <Event />

      <Footer />
    </main>
  );
}
