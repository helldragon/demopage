
import React from 'react';
import type { InspectionOrder } from '../types';
import { Pill } from './Pill';
import { GantryCraneIcon, ForkliftIcon, RtgCraneIcon } from './IconComponents';

interface InspectionListItemProps {
  order: InspectionOrder;
  isSelected: boolean;
  onSelect: () => void;
}

const equipmentIcons: Record<InspectionOrder['equipmentType'], React.ReactNode> = {
    'Gantry Crane': <GantryCraneIcon className="w-6 h-6 text-slate-400" />,
    'Forklift': <ForkliftIcon className="w-6 h-6 text-slate-400" />,
    'RTG Crane': <RtgCraneIcon className="w-6 h-6 text-slate-400" />,
};

export const InspectionListItem: React.FC<InspectionListItemProps> = ({ order, isSelected, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-inset ${
        isSelected ? 'bg-slate-800' : 'hover:bg-slate-800/50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-white">{order.equipmentName}</h3>
        <Pill status={order.status} />
      </div>
      <div className="flex items-center text-sm text-slate-400 gap-4">
        <div className="flex items-center gap-2">
            {equipmentIcons[order.equipmentType]}
            <span>{order.equipmentType}</span>
        </div>
        <span>{order.date}</span>
      </div>
      <p className="text-sm text-slate-300 mt-2 truncate">{order.summary}</p>
    </button>
  );
};
