'use client';

import React from 'react';

interface StatItemProps {
  value: number;
  label: string;
  icon?: React.ReactNode;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, icon }) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow">
      {icon && <div className="flex-shrink-0 mr-4">{icon}</div>}
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
};

export default StatItem;
