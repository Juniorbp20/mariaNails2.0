import { useBusinessProfile } from '../contexts/BusinessProfileContext';
import { toWhatsAppUrl } from '../utils/format';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.11 4.93A9.9 9.9 0 0 0 12.07 2C6.56 2 2.08 6.48 2.08 12c0 1.77.46 3.5 1.33 5.03L2 22l5.12-1.34A9.93 9.93 0 0 0 12.07 22c5.51 0 9.99-4.48 9.99-10 0-2.67-1.04-5.18-2.95-7.07Zm-7.04 15.32a8.24 8.24 0 0 1-4.19-1.14l-.3-.18-3.04.8.81-2.96-.2-.31a8.23 8.23 0 0 1-1.28-4.46c0-4.56 3.71-8.27 8.28-8.27 2.2 0 4.27.86 5.82 2.42A8.2 8.2 0 0 1 20.35 12c0 4.56-3.72 8.27-8.28 8.27Zm4.54-6.2c-.25-.13-1.47-.72-1.7-.8-.23-.08-.4-.12-.57.12-.17.25-.66.8-.81.96-.15.17-.3.19-.56.06-.25-.13-1.06-.39-2.03-1.25a7.6 7.6 0 0 1-1.4-1.74c-.15-.25-.02-.39.11-.52.12-.12.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.37-.78-1.87-.21-.5-.43-.43-.57-.43h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.28 3.79.6.26 1.08.42 1.44.53.61.19 1.17.16 1.61.1.49-.07 1.47-.6 1.68-1.17.21-.57.21-1.06.15-1.17-.06-.1-.23-.17-.48-.3Z" />
    </svg>
  );
}

export default function WhatsAppFloat() {
  const { profile } = useBusinessProfile();
  const url = toWhatsAppUrl(profile.contact_whatsapp || profile.contact_phone || '+18293388282');
  if (!url) return null;

  const withText = url.includes('?') ? `${url}&text=` : `${url}?text=`;
  const href = `${withText}${encodeURIComponent('Hola, quiero reservar una cita en María Nails 💅')}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      title="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 transition hover:-translate-y-1 hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
        <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-200 border-2 border-white" />
      </span>
    </a>
  );
}
