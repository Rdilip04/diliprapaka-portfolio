import Nav from "@/components/Nav";
import HeroExpansion from "@/components/HeroExpansion";
import SelectedWork from "@/components/SelectedWork";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <HeroExpansion />
        <SelectedWork />
      </main>
    </>
  );
}
