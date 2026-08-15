import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CaseStudies from "@/components/CaseStudies";
import About from "@/components/About";
import Approach from "@/components/Approach";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <CaseStudies />
        <About />
        <Approach />
      </main>
      <Footer />
    </>
  );
}
