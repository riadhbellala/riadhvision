import React from 'react';

const ServiceFeature = ({ index, title, description }) => {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-base/5 border border-base/10 flex items-center justify-center flex-shrink-0">
        <span className="text-accent text-sm font-bold">{index}</span>
      </div>
      <div className="flex flex-col pt-1">
        <p className="text-body lg:text-lg font-medium text-base/90">{title}</p>
        {description && <p className="text-sm text-base/70 mt-0.5">{description}</p>}
      </div>
    </div>
  );
};

export default ServiceFeature;
