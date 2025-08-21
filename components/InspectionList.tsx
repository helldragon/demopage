
import React from 'react';
import type { InspectionOrder } from '../types';
import { InspectionListItem } from './InspectionListItem';

interface InspectionListProps {
  orders: InspectionOrder[];
  selectedOrderId: string | null;
  onSelectOrder: (order: InspectionOrder) => void;
}

export const InspectionList: React.FC<InspectionListProps> = ({ orders, selectedOrderId, onSelectOrder }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-900">
      <ul className="divide-y divide-slate-800">
        {orders.map(order => (
          <li key={order.id}>
            <InspectionListItem
              order={order}
              isSelected={order.id === selectedOrderId}
              onSelect={() => onSelectOrder(order)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
