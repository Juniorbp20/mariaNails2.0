import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Booking from './pages/Booking';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import { BusinessProfileProvider } from './contexts/BusinessProfileContext';

function App() {
  return (
    <BrowserRouter>
      <BusinessProfileProvider>
        <div className="flex flex-col min-h-screen bg-white">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/servicios" element={<Services />} />
              <Route path="/galeria" element={<Gallery />} />
              <Route path="/reserva" element={<Booking />} />
              <Route path="/sobre-mi" element={<About />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BusinessProfileProvider>
    </BrowserRouter>
  );
}

export default App;
