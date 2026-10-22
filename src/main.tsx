/**
 * main.tsx — Punto de entrada: monta <App /> en el <div id="root" />.
 *
 * StrictMode ayuda a detectar errores en desarrollo; index.css trae
 * Tailwind y los estilos globales. No agregar lógica aquí.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
