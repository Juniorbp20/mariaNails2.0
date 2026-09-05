import { Clock } from 'lucide-react';
import type { Service } from '../types';
import { formatDuration, formatPrice } from '../utils/format';

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

export default function ServiceCard({ service, onClick }: ServiceCardProps) {
  return (
    <article
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={`Ver detalles de ${service.name}`}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-pink-300 transition cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition">
          {service.name}
        </h3>
        <span className="whitespace-nowrap text-base font-bold text-pink-600">
          {formatPrice(service.price)}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-gray-500 text-sm">
          <Clock className="w-4 h-4" aria-hidden="true" />
          <span>{formatDuration(service.duration_minutes)}</span>
        </div>
        <span className="text-xs font-medium text-pink-600 bg-pink-50 px-2 py-1 rounded">
          {service.category}
        </span>
      </div>
    </article>
  );
}
