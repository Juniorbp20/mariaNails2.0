/**
 * AcrylicPriceTable.tsx — Tabla interactiva de acrílico #1 al #8.
 *
 * Cómo funciona: la clienta elige un largo (#1-#8) y ve los 6 estilos
 * con su precio. El botón pide por WhatsApp con el mensaje listo.
 * Abajo hay una tabla completa con los 48 precios oficiales.
 */
import { useMemo, useState } from 'react';
import { ACRYLIC_STYLES, type AcrylicLength } from '../data/officialCatalog';
import type { Service } from '../types';
import { findServiceForAcrylic } from '../utils/catalog';
import { formatPrice } from '../utils/format';

/** Props: lista de servicios de la BD para enlazar cada card a su reserva. */
interface AcrylicPriceTableProps {
  services: Service[];
}

/** Los 8 largos disponibles. */
const LENGTHS: AcrylicLength[] = [1, 2, 3, 4, 5, 6, 7, 8];

/** Tabla interactiva: selector de largo + cards por estilo + tabla 48 precios. */
export default function AcrylicPriceTable({ services }: AcrylicPriceTableProps) {
  const [selectedLength, setSelectedLength] = useState<AcrylicLength>(3);

  const cards = useMemo(
    () =>
      ACRYLIC_STYLES.map((style) => {
        const dbService = findServiceForAcrylic(services, style.key, selectedLength);
        const officialPrice = style.prices[selectedLength];
        return {
          style,
          dbService,
          price: dbService?.price ?? officialPrice,
          description: dbService?.description || style.description,
        };
      }),
    [services, selectedLength],
  );

  return (
    <div>
      <div className="mb-6">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-purple-700">
          1. Elige el largo de tu uña
        </p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Largo de uña acrílica">
          {LENGTHS.map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={selectedLength === n}
              onClick={() => setSelectedLength(n)}
              className={`h-11 w-11 rounded-full font-bold transition ${
                selectedLength === n
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                  : 'bg-purple-50 text-purple-700 border border-purple-200 hover:border-purple-400 hover:bg-purple-100'
              }`}
            >
              #{n}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Largo seleccionado: <strong className="text-purple-700">#{selectedLength}</strong> — los
          precios se actualizan automáticamente.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ style, price, description }) => (
          <div
            key={style.key}
            className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-white p-5 hover:shadow-lg transition"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-purple-600 mb-1">
              Largo #{selectedLength}
            </p>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{style.label}</h3>
            <p className="text-sm text-gray-600 mb-3">{description}</p>
            <p className="text-2xl font-bold text-pink-600 mb-4">{formatPrice(price)}</p>
            <a
              href={`https://wa.me/18293388282?text=${encodeURIComponent(
                `Hola María Quiero reservar: Acrílico ${style.label} #${selectedLength} (${formatPrice(price)}). Mi nombre es: ___.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 font-semibold text-white transition hover:shadow-lg"
            >
              Reservar #{selectedLength} · {style.shortLabel} por WhatsApp
            </a>
          </div>
        ))}
      </div>

      <details className="mt-6 rounded-xl border border-purple-200 bg-white p-4">
        <summary className="cursor-pointer font-semibold text-purple-700">
          Ver tabla completa #1 – #8 (48 precios oficiales)
        </summary>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="bg-purple-50 text-purple-800">
                <th className="px-3 py-2 text-left font-semibold">Estilo</th>
                {LENGTHS.map((n) => (
                  <th key={n} className="px-3 py-2 text-center font-semibold">
                    #{n}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100">
              {ACRYLIC_STYLES.map((style) => (
                <tr key={style.key} className="hover:bg-pink-50">
                  <td className="px-3 py-2 font-semibold text-gray-900">{style.shortLabel}</td>
                  {LENGTHS.map((n) => (
                    <td
                      key={n}
                      className={`px-3 py-2 text-center font-medium ${
                        n === selectedLength ? 'bg-purple-100 text-purple-800 font-bold' : 'text-gray-700'
                      }`}
                    >
                      RD${style.prices[n].toLocaleString('es-DO')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
