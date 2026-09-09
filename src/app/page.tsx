import { LanguageProvider } from "@/lib/i18n";
import { AppStateProvider } from "@/lib/app-state";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Developments from "@/components/Developments";
import Standard from "@/components/Standard";
import Trust from "@/components/Trust";
import About from "@/components/About";
import Environment from "@/components/Environment";
import Team from "@/components/Team";
import Register from "@/components/Register";
import Footer from "@/components/Footer";
import DevelopmentPage from "@/components/DevelopmentPage";
import CompareBar from "@/components/CompareBar";
import CompareModal from "@/components/CompareModal";
import ThankYouModal from "@/components/ThankYouModal";
import HomeStickyTab from "@/components/HomeStickyTab";

export default function Home() {
  return (
    <LanguageProvider>
      <AppStateProvider>
        <div style={{ background: "#f5f5f7" }}>
          <Nav />
          <Hero />
          <Developments />
          <Standard />
          <Trust />
          <About />
          <Environment />
          <Team />
          <Register />
          <Footer />
        </div>

        <HomeStickyTab />
        <CompareBar />
        <DevelopmentPage />
        <CompareModal />
        <ThankYouModal />
      </AppStateProvider>
    </LanguageProvider>
  );
}
