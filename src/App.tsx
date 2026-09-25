/**
 * App.tsx — Raíz de la app: rutas y estructura común.
 *
 * Rutas: / (inicio), /galeria, /sobre-mi, /precios,
 * /admin y 404. Todo vive dentro de BusinessProfileProvider; Header, Footer,
 * WhatsApp flotante y asistente aparecen en todas las páginas.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ConfigBanner from './components/ConfigBanner';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppFloat from './components/WhatsAppFloat';
import AIAssistant from './components/AIAssistant';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import About from './pages/About';
import PriceCatalog from './pages/PriceCatalog';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import { BusinessProfileProvider } from './contexts/BusinessProfileContext';

/** Componente raíz: router + perfil global + layout común. */
function App() {
  return (
    <BrowserRouter>
      <BusinessProfileProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-white">
          <ConfigBanner />
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/galeria" element={<Gallery />} />
              <Route path="/sobre-mi" element={<About />} />
              <Route path="/precios" element={<PriceCatalog />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppFloat />
          <AIAssistant />
        </div>
      </BusinessProfileProvider>
    </BrowserRouter>
  );
}

export default App;
