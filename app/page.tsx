import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Toolkit from "@/components/Toolkit";
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
        <Toolkit />
        <CaseStudies />
        <About />
        <Approach />
      </main>
      <Footer />
    </>
  );
}
