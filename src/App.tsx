/**
 * App.tsx — Raíz de la app: rutas y estructura común.
 *
 * Sitio 100% estático, sin base de datos:
 * Rutas: / (inicio), /galeria (puente a Instagram), /sobre-mi, /precios y 404.
 * Header, Footer, WhatsApp flotante y asistente aparecen en todas las páginas.
 */
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RouteMeta from './components/RouteMeta';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppFloat from './components/WhatsAppFloat';
import AIAssistant from './components/AIAssistant';
import Home from './pages/Home';

const Gallery = lazy(() => import('./pages/Gallery'));
const About = lazy(() => import('./pages/About'));
const PriceCatalog = lazy(() => import('./pages/PriceCatalog'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <span className="text-gray-500">Cargando…</span>
    </div>
  );
}

/** Componente raíz: router + layout común, sin providers de datos. */
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <RouteMeta />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-pink-700 focus:shadow-lg"
      >
        Saltar al contenido
      </a>
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/galeria" element={<Gallery />} />
              <Route path="/sobre-mi" element={<About />} />
              <Route path="/precios" element={<PriceCatalog />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <WhatsAppFloat />
        <AIAssistant />
      </div>
    </BrowserRouter>
  );
}

export default App;
