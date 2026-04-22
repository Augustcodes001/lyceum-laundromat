// import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import HowItWorks from '../components/HowItWorks';
import DeliveryUpdates from '../components/DeliveryUpdates';
// import Testimonials from '../components/Testimonials'
import CustomerTestimonials from '../components/CustomerTestimonials'
import WhyLoveLyceum from '../components/WhyLoveLyceum';
import ImageGrid from '../components/ImageGrid';
import GuaranteeBackground from '../components/GuaranteeBackground';
import Footer from '../components/Footer';


export default function Home({ onOpenAuth }) {
  return (
    // <div className="bg-white min-h-screen font-sans text-lyceum-dark">
    <div className="w-full min-h-screen">
      {/* Premium Sticky Navigation Bar */}
      {/* <Header /> */}

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Services Section */}
      <Services onOpenAuth={onOpenAuth} />
      {/* HowItWorks Section */}
      <HowItWorks />
      {/* DeliveryUpdates Section */}
      <DeliveryUpdates />
      {/* <Testimonials /> */}
      <CustomerTestimonials />

      <WhyLoveLyceum />
      <ImageGrid />
      <GuaranteeBackground />
      {/* Footer Block */}
      <Footer />
    </div>
  );
}
