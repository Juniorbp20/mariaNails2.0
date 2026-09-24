/**
 * AIAssistant.tsx — Asistente virtual flotante (botón 💬 abajo-izquierda).
 *
 * Cómo funciona: chat con respuestas por palabras clave (precios, acrílico,
 * pedicura, dirección, pagos, 24h/15min...). No usa IA externa ni cuesta
 * dinero: todo sale de officialCatalog.ts. Incluye atajos rápidos y enlaces
 * a /precios y WhatsApp. Para una IA real, usa ASSISTANT_SYSTEM_PROMPT.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, MessageCircle } from 'lucide-react';
import { ACRYLIC_STYLES, BUSINESS_INFO, COURTESIES } from '../data/officialCatalog';
import { WHATSAPP_TEMPLATES, waLink } from '../data/whatsappTemplates';

/** Un mensaje del chat: 'bot' (asistente) o 'user' (visitante). */
interface ChatMsg {
  from: 'bot' | 'user';
  text: string;
}

/**
 * Elige la respuesta según palabras clave del mensaje.
 * Ej: si escriben "pedicura" responde precio + duración + WhatsApp.
 */
function getBotReply(input: string): string {
  const q = input.toLowerCase();

  if (q.match(/precio|cuanto|cuánto|costo|tarifa/)) {
    return `Con gusto mi amor Precios oficiales:\n• Seco RD$250 | Seco Gel RD$450\n• Regular RD$600 | Gel RD$800\n• Gel natural RD$450 | Sistemas Gel desde RD$1,234\n• Pedicura RD$1,234 (3h spa)\n• Acrílico #1-#8: Pintura 750-1400, Cover Liso 800-1800, French 850-1800, Acrílico+Gel 900-1900, Baby Boomer 950-2000, Full Set 1000-2100.\n¿Te ayudo a reservar?`;
  }
  if (q.match(/acrilic|#\d|largo|cover|baby|full/)) {
    const rows = ACRYLIC_STYLES.map(
      (s) => `${s.shortLabel}: #1 RD$${s.prices[1]} → #8 RD$${s.prices[8]}`,
    ).join('\n• ');
    return `Acrílico del #1 al #8 \n• ${rows}\nDime tu largo y estilo y te digo el precio exacto. Ej: “Cover Liso #4 = RD$1,250”.`;
  }
  if (q.match(/pedicura|pie/)) {
    return `Pedicura completa RD$1,234 Aprox. 3 horas: exfoliación, hidratación profunda, tratamiento y esmaltado + coffee bar ☕. Solo con cita previa al ${BUSINESS_INFO.phoneDisplay}.`;
  }
  if (q.match(/manicura|mano|gel/)) {
    return `Manicura Seco 250, Seco Gel 450, Regular 600, Gel 800. Gel uña natural 450. Sistemas Rubber/Acry/Builder desde 1234. Todas con hidratación 💜.`;
  }
  if (q.match(/nail|arte|diseño|diseno|3d|piedra|sticker/)) {
    return `Nail Art Mano alzada, stickers, 3D, pedrería y gel sólido. Envíame tus fotos de referencia por WhatsApp y te cotizamos con amor 💜.`;
  }
  if (q.match(/donde|donde|ubic|direcc|tenares|llegar|mapa/)) {
    return `Estamos en ${BUSINESS_INFO.addressLine1} (${BUSINESS_INFO.addressLine2}) Te esperamos con cafecito y galletitas ☕🍪.`;
  }
  if (q.match(/pago|banreservas|transfer|cuenta|efectivo|seña|sena|deposito/)) {
    return `Pagos Efectivo en local o transferencia ${BUSINESS_INFO.bank} cuenta ${BUSINESS_INFO.bankAccount} a nombre de ${BUSINESS_INFO.bankHolder}. Si cancelas con menos de 24h no se devuelve la seña.`;
  }
  if (q.match(/cancel|reprogram|posponer/)) {
    return `Puedes cancelar sin costo con 24h de anticipación Con menos de 24h pierdes la seña. Escríbenos al ${BUSINESS_INFO.phoneDisplay} con tu fecha/hora.`;
  }
  if (q.match(/tarde|puntual|15|minuto|hora/)) {
    return `Te esperamos máximo 15 min pasada tu hora Luego el turno queda libre. Avísanos por WhatsApp si vienes en camino 💜.`;
  }
  if (q.match(/cafe|coffee|cortesia|te|jugo|galleta/)) {
    return `Coffee bar gratis ☕: ${COURTESIES.join(', ')}. Para todas nuestras clientas durante su cita.`;
  }
  if (q.match(/cita|reserva|agenda|apartar|turno|whatsapp/)) {
    return `Reserva solo por WhatsApp al ${BUSINESS_INFO.phoneDisplay} Dime servicio + fecha + hora y te confirmamos. ${BUSINESS_INFO.modality}`;
  }
  if (q.match(/hola|buenas|saludos|buenos/)) {
    return WHATSAPP_TEMPLATES.bienvenida;
  }
  return `Gracias por escribirnos Soy la asistente de ${BUSINESS_INFO.name}. Puedo ayudarte con precios, acrílico #1-#8, dirección, pagos ${BUSINESS_INFO.bank}, políticas 24h/15min y reservas al ${BUSINESS_INFO.phoneDisplay}. ¿Qué te gustaría hoy? Prueba: “precio pedicura” o “acrílico #5”.`;
}

/** Botones de acceso rápido dentro del chat. */
const QUICK = ['Precios', 'Acrílico #1-#8', 'Pedicura 3h', 'Dirección', 'Reservar'];

/** Asistente flotante: botón + ventana de chat con historial y formulario. */
export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([
    { from: 'bot', text: WHATSAPP_TEMPLATES.bienvenida },
  ]);

  /** Envía un mensaje del usuario y agrega la respuesta del bot al historial. */
  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const reply = getBotReply(clean);
    setMessages((prev) => [...prev, { from: 'user', text: clean }, { from: 'bot', text: reply }]);
    setInput('');
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir asistente virtual"
          title="Asistente virtual"
          className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl shadow-purple-500/30 transition hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
        >
          <MessageCircle className="h-7 w-7" aria-hidden="true" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 left-5 z-50 flex h-[480px] w-[330px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                  <Bot className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-bold">Asistente María</p>
                  <p className="text-xs opacity-90">Tono lila · Respuestas oficiales · {BUSINESS_INFO.phoneDisplay}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar asistente"
                className="rounded-full bg-white/20 px-2 py-1 text-sm hover:bg-white/30"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto bg-gradient-to-b from-purple-50 to-white p-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm ${
                    m.from === 'user'
                      ? 'bg-purple-600 text-white rounded-br-sm'
                      : 'bg-white border border-purple-100 text-gray-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-purple-100 bg-white p-2">
            <div className="mb-2 flex flex-wrap gap-1">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-purple-200 bg-purple-50 px-2 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-100"
                >
                  {q}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ej: precio acrílico #4..."
                className="flex-1 rounded-full border border-purple-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-bold text-white"
              >
                ➤
              </button>
            </form>
            <div className="mt-2 flex gap-2 text-xs">
              <Link to="/precios" className="font-semibold text-purple-700 underline">
                Ver catálogo
              </Link>
              <a
                href={waLink('Hola María Vengo del asistente web y quiero reservar. Mi nombre es: ___.')}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-600 underline"
              >
                Seguir por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
