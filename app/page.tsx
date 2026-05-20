import About from "@/components/About";
import AchievementsSection from "@/components/Achievementssection";
import BlogPreviewSection from "@/components/Blogpreviewsection";
import Books from "@/components/Books";
import Event from "@/components/Event";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import NewsletterSection from "@/components/Newslettersection";
import Testimonial from "@/components/Testimonial";
import WhyFollowSection from "@/components/Whyfollowsection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Books />
      <WhyFollowSection />
      {/* <ServicesSection /> */}
      <AchievementsSection />
      <Testimonial />
      <BlogPreviewSection />

      <Event />
      <NewsletterSection />

      <Footer />
    </main>
  );
}
