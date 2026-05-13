import React from 'react';
import { Cloud, Code2, ShoppingCart, LayoutTemplate, MonitorSmartphone, PenTool } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';

const servicesList = [
  {
    title: "SaaS Development",
    description: "End-to-end development of scalable Software-as-a-Service applications with robust architectures.",
    icon: Cloud
  },
  {
    title: "Custom Platforms",
    description: "Complex web platforms tailored for specific business needs, from dashboards to internal tools.",
    icon: Code2
  },
  {
    title: "E-commerce Sites",
    description: "High-performance online stores optimized for conversion and seamless payment integrations.",
    icon: ShoppingCart
  },
  {
    title: "Landing Pages",
    description: "High-converting, cinematic landing pages designed to capture leads and drive sales.",
    icon: LayoutTemplate
  },
  {
    title: "Vitrine Sites",
    description: "Premium showcase websites to establish a strong digital presence and brand identity.",
    icon: MonitorSmartphone
  },
  {
    title: "UI/UX Design",
    description: "Crafting intuitive and engaging user experiences from wireframes to final pixel-perfect polish.",
    icon: PenTool
  }
];

const Services = () => {
  return (
    <section id="services" className="relative z-30 py-32 px-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-16 font-syne text-white text-center">
          What I Build
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {servicesList.map((service, index) => (
            <ServiceCard 
              key={index}
              index={index}
              title={service.title}
              description={service.description}
              Icon={service.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
