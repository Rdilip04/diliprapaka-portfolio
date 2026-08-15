import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Recognition from "@/components/Recognition";
import CaseStudies from "@/components/CaseStudies";
import About from "@/components/About";
import Approach from "@/components/Approach";
import Footer from "@/components/Footer";
import { TextLoop } from "@/components/ui/text-loop";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Recognition />
        {/* Names the sector before the work does. The hero deliberately stays
            broad, so this is the first thing that says "healthcare". */}
        <TextLoop
          text="Healthcare · Accessibility · Research-led · Data-rich interfaces"
          className="border-y border-ink/12 bg-canvas"
        />
        <CaseStudies />
        <About />
        <Approach />
      </main>
      <Footer />
    </>
  );
}
