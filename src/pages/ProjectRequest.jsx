import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../lib/supabase';

const ProjectRequest = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    serviceCategory: "",
    serviceType: "",
    projectDescription: "",
    hasVisualIdentity: null,
    keyFeatures: [],
    predictedBudget: "",
    timeline: "",
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Main Categories
  const categories = [
    { id: "web_dev", title: "Web Development", icon: "lucide:layout" },
    { id: "mobile_app", title: "Mobile App", icon: "lucide:smartphone" },
    { id: "ui_ux", title: "UI/UX Design", icon: "lucide:pen-tool" },
    { id: "backend", title: "Backend/Systems", icon: "lucide:server" },
  ];

  // Sub-categories
  const serviceTypes = {
    web_dev: ["E-commerce", "SaaS Platform", "Site Vitrine", "Landing Page", "Custom Web App"],
    mobile_app: ["iOS Native", "Android Native", "Cross-Platform", "App Redesign"],
    ui_ux: ["Full Product Design", "Wireframing", "Web Design", "App Design", "Design Audit"],
    backend: ["REST API", "Database Architecture", "Cloud Infrastructure", "System Integration"],
  };

  const featureOptions = [
    "Login System",
    "Subscription",
    "Payment System",
    "CMS",
    "Contact Forms",
    "Live Chat",
    "Blog",
    "Gallery",
    "Dashboard"
  ];

  const budgets = ["Under 50,000 DA", "50,000 DA - 100,000 DA", "100,000 DA - 250,000 DA", "250,000 DA+"];
  const timelines = ["Under 2 weeks", "2-4 weeks", "1-2 months", "3+ months"];

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.serviceCategory !== "";
      case 1:
        return formData.serviceType !== "" && formData.projectDescription.trim() !== "" && formData.hasVisualIdentity !== null;
      case 2:
        return formData.keyFeatures.length > 0;
      case 3:
        return formData.predictedBudget !== "" && formData.timeline !== "";
      case 4:
        return formData.name.trim() !== "" && formData.email.trim() !== "" && formData.phone.trim() !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid() && currentStep < 4) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!isStepValid()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from('project_requests').insert([
        {
          service_type: formData.serviceCategory,
          project_type: formData.serviceType,
          features: formData.keyFeatures,
          has_design: formData.hasVisualIdentity,
          budget: formData.predictedBudget,
          timeline: formData.timeline,
          full_name: formData.name,
          email: formData.email,
          whatsapp: formData.phone,
          project_description: formData.projectDescription,
        },
      ]);

      if (error) {
        console.error('Supabase insert error:', error);
        alert('Something went wrong. Please try again.');
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        if (e.target.tagName === "TEXTAREA") return; // Allow newlines in textarea
        e.preventDefault();
        if (currentStep === 4) {
          handleSubmit();
        } else {
          handleNext();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, formData]);

  const updateForm = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFeature = (feature) => {
    setFormData((prev) => {
      const isSelected = prev.keyFeatures.includes(feature);
      if (isSelected) {
        return { ...prev, keyFeatures: prev.keyFeatures.filter((f) => f !== feature) };
      } else {
        return { ...prev, keyFeatures: [...prev.keyFeatures, feature] };
      }
    });
  };

  const stepVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { type: "spring", stiffness: 300, damping: 30 } 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.98, 
      transition: { duration: 0.2 } 
    },
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030303] flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto font-sans pb-40 pt-24">
      
      {/* Premium ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#a1ebd4]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#2c5584]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header / Nav */}
      <div className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50">
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 text-white/50 hover:text-white transition-all duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium tracking-wide">Back</span>
        </button>
        <div className="text-white/30 text-sm font-medium tracking-widest">
          {isSubmitted ? "COMPLETED" : `STEP ${currentStep + 1} OF 5`}
        </div>
      </div>

      {/* Ultra-thin continuous progress bar at the very top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-50">
        <motion.div 
          className="h-full bg-[#a1ebd4]"
          initial={{ width: "0%" }}
          animate={{ width: `${isSubmitted ? 100 : ((currentStep) / 5) * 100}%` }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-3xl px-6 md:px-12 flex flex-col items-center justify-center min-h-[60vh]">
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center gap-6"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[#a1ebd4] blur-[40px] opacity-20 rounded-full" />
              <div className="w-24 h-24 bg-[#a1ebd4]/10 border border-[#a1ebd4]/30 text-[#a1ebd4] rounded-full flex items-center justify-center relative z-10">
                <Icon icon="lucide:check" className="w-10 h-10" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight">Request Received</h2>
            <p className="text-white/50 text-lg max-w-md">
              Thank you, {formData.name}. I've received your project details and will be in touch very soon.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-8 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-[#a1ebd4] transition-colors duration-300 hover:shadow-[0_0_30px_rgba(161,235,212,0.3)]"
            >
              Return to Portfolio
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Category */}
            {currentStep === 0 && (
              <motion.div key="step0" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col items-center">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-5xl font-light text-white mb-4 tracking-tight">What do you need?</h2>
                  <p className="text-white/40 text-lg">Select the primary focus of your project.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        updateForm("serviceCategory", cat.id);
                        updateForm("serviceType", "");
                        setTimeout(handleNext, 300); // slight delay for visual feedback
                      }}
                      className={`group relative flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border transition-all duration-300 overflow-hidden ${
                        formData.serviceCategory === cat.id
                          ? "bg-[#a1ebd4]/10 border-[#a1ebd4] text-white shadow-[0_0_30px_rgba(161,235,212,0.15)]"
                          : "bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/[0.04] hover:border-white/10 hover:-translate-y-1"
                      }`}
                    >
                      <Icon icon={cat.icon} className={`w-10 h-10 transition-colors duration-300 ${formData.serviceCategory === cat.id ? "text-[#a1ebd4]" : "text-white/40 group-hover:text-white"}`} />
                      <span className="font-medium text-lg">{cat.title}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Service Type & Description */}
            {currentStep === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col max-w-2xl mx-auto">
                <div className="mb-10 text-center">
                  <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">Project Specifics</h2>
                  <p className="text-white/40 text-lg">Help me understand exactly what we're building.</p>
                </div>
                
                <div className="flex flex-col gap-10">
                  {/* Type of Service */}
                  <div className="flex flex-col items-center gap-5">
                    <span className="text-white/60 text-sm font-medium uppercase tracking-widest">1. Type of Service</span>
                    <div className="flex flex-wrap justify-center gap-3">
                      {serviceTypes[formData.serviceCategory]?.map((type) => (
                        <button
                          key={type}
                          onClick={() => updateForm("serviceType", type)}
                          className={`px-6 py-3 rounded-full border transition-all duration-300 text-sm font-medium ${
                            formData.serviceType === type
                              ? "bg-[#a1ebd4]/15 border-[#a1ebd4]/50 text-[#a1ebd4] shadow-[0_0_15px_rgba(161,235,212,0.2)]"
                              : "bg-transparent border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-white/60 text-sm font-medium uppercase tracking-widest">2. The Idea</span>
                    <textarea
                      value={formData.projectDescription}
                      onChange={(e) => updateForm("projectDescription", e.target.value)}
                      placeholder="Briefly describe your goals, audience, and vision..."
                      className="w-full h-32 bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-white placeholder-white/20 focus:outline-none focus:border-[#a1ebd4]/50 focus:bg-white/[0.05] transition-all resize-none text-base leading-relaxed"
                    />
                  </div>

                  {/* Visual Identity */}
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-white/60 text-sm font-medium uppercase tracking-widest">3. Visual Identity</span>
                    <p className="text-white/40 text-sm text-center">Do you already have a logo, brand colors, or a Figma design?</p>
                    <div className="flex gap-4 w-full max-w-sm">
                      <button
                        onClick={() => updateForm("hasVisualIdentity", true)}
                        className={`flex-1 py-4 rounded-2xl border transition-all duration-300 font-medium ${
                          formData.hasVisualIdentity === true
                            ? "bg-[#a1ebd4]/15 border-[#a1ebd4]/50 text-[#a1ebd4] shadow-[0_0_15px_rgba(161,235,212,0.2)]"
                            : "bg-transparent border-white/10 text-white/50 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        Yes, I do
                      </button>
                      <button
                        onClick={() => updateForm("hasVisualIdentity", false)}
                        className={`flex-1 py-4 rounded-2xl border transition-all duration-300 font-medium ${
                          formData.hasVisualIdentity === false
                            ? "bg-[#a1ebd4]/15 border-[#a1ebd4]/50 text-[#a1ebd4] shadow-[0_0_15px_rgba(161,235,212,0.2)]"
                            : "bg-transparent border-white/10 text-white/50 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        No, start fresh
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Key Functionalities */}
            {currentStep === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col items-center">
                <div className="mb-12 text-center">
                  <h2 className="text-3xl md:text-5xl font-light text-white mb-4 tracking-tight">Key Features</h2>
                  <p className="text-white/40 text-lg">Select the core functionalities your project requires.</p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-2xl">
                  {featureOptions.map((feature) => {
                    const isSelected = formData.keyFeatures.includes(feature);
                    return (
                      <button
                        key={feature}
                        onClick={() => toggleFeature(feature)}
                        className={`flex items-center gap-2 px-6 py-4 rounded-full border transition-all duration-300 text-sm md:text-base font-medium ${
                          isSelected
                            ? "bg-[#a1ebd4]/15 border-[#a1ebd4]/50 text-[#a1ebd4] shadow-[0_0_15px_rgba(161,235,212,0.2)] -translate-y-1"
                            : "bg-white/[0.02] border-white/10 text-white/60 hover:border-white/30 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {feature}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                            >
                              <Icon icon="lucide:check" className="w-4 h-4" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: Budget & Timeline */}
            {currentStep === 3 && (
              <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col items-center">
                <div className="mb-12 text-center">
                  <h2 className="text-3xl md:text-5xl font-light text-white mb-4 tracking-tight">Logistics</h2>
                  <p className="text-white/40 text-lg">Let's align on expectations.</p>
                </div>
                
                <div className="flex flex-col gap-12 w-full max-w-2xl">
                  {/* Budget */}
                  <div className="flex flex-col gap-6">
                    <span className="text-white/60 text-sm font-medium uppercase tracking-widest text-center">Expected Budget</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      {budgets.map((b) => (
                        <button
                          key={b}
                          onClick={() => updateForm("predictedBudget", b)}
                          className={`p-5 rounded-2xl border transition-all duration-300 text-center font-medium ${
                            formData.predictedBudget === b
                              ? "bg-[#a1ebd4]/15 border-[#a1ebd4]/50 text-[#a1ebd4] shadow-[0_0_15px_rgba(161,235,212,0.2)]"
                              : "bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/5 hover:text-white hover:border-white/20"
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex flex-col gap-6">
                    <span className="text-white/60 text-sm font-medium uppercase tracking-widest text-center">Desired Timeline</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                      {timelines.map((t) => (
                        <button
                          key={t}
                          onClick={() => updateForm("timeline", t)}
                          className={`p-4 rounded-2xl border transition-all duration-300 text-center text-sm font-medium ${
                            formData.timeline === t
                              ? "bg-[#a1ebd4]/15 border-[#a1ebd4]/50 text-[#a1ebd4] shadow-[0_0_15px_rgba(161,235,212,0.2)]"
                              : "bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/5 hover:text-white hover:border-white/20"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Personal Info */}
            {currentStep === 4 && (
              <motion.div key="step4" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col items-center">
                <div className="mb-12 text-center">
                  <h2 className="text-3xl md:text-5xl font-light text-white mb-4 tracking-tight">Final Step</h2>
                  <p className="text-white/40 text-lg">Where should I send the proposal?</p>
                </div>
                
                <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-white/50 text-xs font-semibold uppercase tracking-wider ml-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => updateForm("name", e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#a1ebd4]/50 focus:bg-white/[0.05] transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-white/50 text-xs font-semibold uppercase tracking-wider ml-1">Company (Optional)</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => updateForm("company", e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#a1ebd4]/50 focus:bg-white/[0.05] transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-white/50 text-xs font-semibold uppercase tracking-wider ml-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#a1ebd4]/50 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-white/50 text-xs font-semibold uppercase tracking-wider ml-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#a1ebd4]/50 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </div>

      {/* Footer Navigation (Only show if not submitted) */}
      {!isSubmitted && (
        <div className="fixed bottom-0 left-0 w-full p-6 md:p-10 flex flex-col items-center justify-center pointer-events-none z-50">
          <div className="flex items-center gap-4 pointer-events-auto">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/5 hover:text-white transition-all duration-300"
              >
                <Icon icon="lucide:arrow-up" className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={currentStep === 4 ? handleSubmit : handleNext}
              disabled={!isStepValid() || isLoading}
              className="flex items-center gap-3 px-8 h-14 bg-[#a1ebd4] text-black font-bold rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors duration-300 shadow-[0_0_20px_rgba(161,235,212,0.2)] disabled:shadow-none"
            >
              {currentStep === 4
                ? (isLoading ? 'Sending...' : 'Submit Proposal')
                : 'OK'
              }
              <Icon icon={currentStep === 4 ? (isLoading ? 'lucide:loader' : 'lucide:send') : 'lucide:arrow-right'} className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="mt-4 text-white/30 text-xs font-medium tracking-wide flex items-center gap-2">
            <span>press</span>
            <kbd className="px-2 py-1 bg-white/10 rounded-md font-sans text-[10px] text-white/70">Enter ↵</kbd>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectRequest;
