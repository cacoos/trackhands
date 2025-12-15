import { Features, Footer, Hero, HowItWorks, Navbar, Privacy } from "./components";

function App() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#2d2d2d_0%,#1a1a1a_50%)] pointer-events-none" />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Privacy />

      <Footer />
    </div>
  );
}

export default App;
