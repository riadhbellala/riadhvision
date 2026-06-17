import React from 'react';

const ServiceFeature = ({ index, title, description }) => {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
        <span className="text-[#a1ebd4] text-sm font-bold">{index}</span>
      </div>
      <div className="flex flex-col pt-1">
        <p className="text-base lg:text-lg font-medium text-white/90">{title}</p>
        {description && <p className="text-sm text-white/50 mt-0.5">{description}</p>}
      </div>
    </div>
  );
};

export default ServiceFeature;
