import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Event from "@/components/Event";
import CtaBand from "@/components/CtaBand";
import Testimonial from "@/components/Testimonial";
import Service from "@/components/Service";
import Books from "@/components/Books";
import About from "@/components/About";

export default function Home() {
    return (
        <main>

        <Navbar />
         <Hero />
            <About />
            <Books />
            <Service />
            <Testimonial />

            <CtaBand />
           <Event />

       <Footer/>
        </main>
    );
}
