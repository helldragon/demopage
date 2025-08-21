import React from 'react';
import type { InspectionOrder } from '../types';

interface PillProps {
  status: InspectionOrder['status'];
}

export const Pill: React.FC<PillProps> = ({ status }) => {
  const baseClasses = 'px-2 py-0.5 text-xs font-medium rounded-full';
  
  const statusStyles: Record<InspectionOrder['status'], string> = {
    '正常': 'bg-green-500/20 text-green-300',
    '异常': 'bg-yellow-500/20 text-yellow-300',
    '紧急': 'bg-red-500/20 text-red-300',
  };

  return (
    <span className={`${baseClasses} ${statusStyles[status]}`}>
      {status}
    </span>
  );
};