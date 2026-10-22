/**
 * App.tsx — Raíz de la app: rutas y estructura común.
 *
 * Sitio 100% estático, sin base de datos:
 * Rutas: / (inicio), /galeria (puente a Instagram), /sobre-mi, /precios y 404.
 * Header, Footer, WhatsApp flotante y asistente aparecen en todas las páginas.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppFloat from './components/WhatsAppFloat';
import AIAssistant from './components/AIAssistant';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import About from './pages/About';
import PriceCatalog from './pages/PriceCatalog';
import NotFound from './pages/NotFound';

/** Componente raíz: router + layout común, sin providers de datos. */
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/galeria" element={<Gallery />} />
            <Route path="/sobre-mi" element={<About />} />
            <Route path="/precios" element={<PriceCatalog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppFloat />
        <AIAssistant />
      </div>
    </BrowserRouter>
  );
}

export default App;
