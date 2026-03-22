import { Clock, DollarSign } from 'lucide-react';
import type { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

export default function ServiceCard({ service, onClick }: ServiceCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer group"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition">
        {service.name}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>{service.duration_minutes} min</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <DollarSign className="w-4 h-4" />
            <span>${service.price}</span>
          </div>
        </div>
        <span className="text-xs font-medium text-pink-600 bg-pink-50 px-2 py-1 rounded">
          {service.category}
        </span>
      </div>
    </div>
  );
}
