import React, { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
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
  const descriptionRef = useRef(null);

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
      // Focus outline support or 'Enter' to submit/continue
      if (e.key === "Enter" && !e.shiftKey) {
        if (e.target.tagName === "TEXTAREA") return;
        e.preventDefault();
        if (isStepValid()) {
          if (currentStep === 4) {
            handleSubmit();
          } else {
            handleNext();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Focus the description textarea when arriving at step 1
  useEffect(() => {
    if (currentStep === 1 && descriptionRef.current) {
      setTimeout(() => {
        descriptionRef.current.focus();
      }, 100);
    }
  }, [currentStep]);

  // Framer Motion variants
  const stepVariants = {
    initial: { opacity: 0, x: 10 },
    animate: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.2, ease: "easeOut" } 
    },
    exit: { 
      opacity: 0, 
      x: -10, 
      transition: { duration: 0.15, ease: "easeIn" } 
    },
  };

  const StepHeader = ({ title, subtitle }) => (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-1.5">{title}</h2>
      <p className="text-[14px] text-[#888]">{subtitle}</p>
    </div>
  );

  const ContinueButton = () => (
    <div className="mt-10 flex items-center gap-4 border-t border-[#1a1a1a] pt-6">
      <button
        onClick={handleNext}
        disabled={!isStepValid()}
        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-black text-[13px] font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#e0e0e0] transition-colors"
      >
        Continue
      </button>
      <div className="text-[11px] text-[#555] font-medium flex items-center gap-1.5">
        press <kbd className="px-1.5 py-0.5 border border-[#333] bg-[#1a1a1a] rounded text-[10px] text-[#888] font-mono">Enter ↵</kbd>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col items-center">
      
      {/* Top Header */}
      <header className="w-full h-16 border-b border-[#1a1a1a] flex flex-col justify-center bg-[#0a0a0a] fixed top-0 z-50">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#111]">
          <motion.div 
            className="h-full bg-white"
            initial={{ width: "0%" }}
            animate={{ width: `${isSubmitted ? 100 : ((currentStep + 1) / 5) * 100}%` }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          />
        </div>
        <div className="w-full max-w-4xl mx-auto px-6 flex justify-between items-center">
          <button
            onClick={() => currentStep > 0 && !isSubmitted ? handleBack() : navigate("/")}
            className="flex items-center gap-2 text-[13px] font-medium text-[#666] hover:text-white transition-colors"
          >
            <Icon icon="lucide:arrow-left" className="w-4 h-4" />
            {currentStep > 0 && !isSubmitted ? "Back" : "Exit"}
          </button>
          <div className="text-[12px] font-semibold text-[#555] uppercase tracking-widest">
            {isSubmitted ? "COMPLETED" : `Step ${currentStep + 1} of 5`}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-2xl px-6 pt-32 pb-24 flex-1 flex flex-col">
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center mt-20"
          >
            <div className="w-16 h-16 bg-[#1a1a1a] border border-[#333] rounded-2xl flex items-center justify-center mb-6">
              <Icon icon="lucide:check" className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Request Received</h2>
            <p className="text-[14px] text-[#888] max-w-md leading-relaxed mb-8">
              Thank you, {formData.name}. Your project details have been successfully submitted. I will review them and get back to you shortly.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 bg-white text-black text-[13px] font-semibold rounded-lg hover:bg-[#e0e0e0] transition-colors"
            >
              Return to Portfolio
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Category */}
            {currentStep === 0 && (
              <motion.div key="step0" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="w-full">
                <StepHeader 
                  title="What do you need?" 
                  subtitle="Select the primary focus of your project." 
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        updateForm("serviceCategory", cat.id);
                        updateForm("serviceType", "");
                      }}
                      className={`flex flex-col gap-3 p-5 rounded-xl border text-left transition-colors duration-150 ${
                        formData.serviceCategory === cat.id
                          ? "bg-[#161616] border-[#444]"
                          : "bg-[#0f0f0f] border-[#1a1a1a] hover:bg-[#121212] hover:border-[#2a2a2a]"
                      }`}
                    >
                      <Icon icon={cat.icon} className={`w-6 h-6 ${formData.serviceCategory === cat.id ? "text-white" : "text-[#555]"}`} />
                      <div>
                        <span className={`block text-[14px] font-semibold ${formData.serviceCategory === cat.id ? "text-white" : "text-[#aaa]"}`}>{cat.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <ContinueButton />
              </motion.div>
            )}

            {/* STEP 2: Service Type & Description */}
            {currentStep === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col gap-8">
                <StepHeader 
                  title="Project specifics" 
                  subtitle="Help me understand exactly what we're building." 
                />
                
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest">Type of Service</label>
                  <div className="flex flex-wrap gap-2">
                    {serviceTypes[formData.serviceCategory]?.map((type) => (
                      <button
                        key={type}
                        onClick={() => updateForm("serviceType", type)}
                        className={`px-4 py-2 rounded-lg border text-[13px] font-medium transition-colors ${
                          formData.serviceType === type
                            ? "bg-[#161616] border-[#444] text-white"
                            : "bg-[#0f0f0f] border-[#1a1a1a] text-[#888] hover:bg-[#121212] hover:text-[#bbb]"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest">Description</label>
                  <textarea
                    ref={descriptionRef}
                    value={formData.projectDescription}
                    onChange={(e) => updateForm("projectDescription", e.target.value)}
                    placeholder="Briefly describe your goals, audience, and vision..."
                    className="w-full h-32 bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-4 text-[14px] text-white placeholder-[#444] focus:outline-none focus:border-[#444] focus:bg-[#111] transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest">Visual Identity</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateForm("hasVisualIdentity", true)}
                      className={`p-4 rounded-xl border text-[13px] font-medium transition-colors ${
                        formData.hasVisualIdentity === true
                          ? "bg-[#161616] border-[#444] text-white"
                          : "bg-[#0f0f0f] border-[#1a1a1a] text-[#888] hover:bg-[#121212]"
                      }`}
                    >
                      Yes, I have designs
                    </button>
                    <button
                      onClick={() => updateForm("hasVisualIdentity", false)}
                      className={`p-4 rounded-xl border text-[13px] font-medium transition-colors ${
                        formData.hasVisualIdentity === false
                          ? "bg-[#161616] border-[#444] text-white"
                          : "bg-[#0f0f0f] border-[#1a1a1a] text-[#888] hover:bg-[#121212]"
                      }`}
                    >
                      No, start fresh
                    </button>
                  </div>
                </div>
                
                <ContinueButton />
              </motion.div>
            )}

            {/* STEP 3: Key Functionalities */}
            {currentStep === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col gap-6">
                <StepHeader 
                  title="Key features" 
                  subtitle="Select the core functionalities your project requires." 
                />
                <div className="flex flex-wrap gap-2">
                  {featureOptions.map((feature) => {
                    const isSelected = formData.keyFeatures.includes(feature);
                    return (
                      <button
                        key={feature}
                        onClick={() => toggleFeature(feature)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[13px] font-medium transition-colors ${
                          isSelected
                            ? "bg-[#161616] border-[#444] text-white"
                            : "bg-[#0f0f0f] border-[#1a1a1a] text-[#888] hover:bg-[#121212] hover:border-[#2a2a2a] hover:text-[#bbb]"
                        }`}
                      >
                        <Icon 
                          icon="lucide:check" 
                          className={`w-3.5 h-3.5 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} 
                        />
                        {feature}
                      </button>
                    );
                  })}
                </div>
                <ContinueButton />
              </motion.div>
            )}

            {/* STEP 4: Budget & Timeline */}
            {currentStep === 3 && (
              <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col gap-8">
                <StepHeader 
                  title="Logistics" 
                  subtitle="Let's align on expectations." 
                />
                
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest">Expected Budget</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {budgets.map((b) => (
                      <button
                        key={b}
                        onClick={() => updateForm("predictedBudget", b)}
                        className={`p-4 rounded-xl border text-left text-[13px] font-medium transition-colors ${
                          formData.predictedBudget === b
                            ? "bg-[#161616] border-[#444] text-white"
                            : "bg-[#0f0f0f] border-[#1a1a1a] text-[#888] hover:bg-[#121212] hover:border-[#2a2a2a]"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest">Desired Timeline</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {timelines.map((t) => (
                      <button
                        key={t}
                        onClick={() => updateForm("timeline", t)}
                        className={`p-4 rounded-xl border text-center text-[13px] font-medium transition-colors ${
                          formData.timeline === t
                            ? "bg-[#161616] border-[#444] text-white"
                            : "bg-[#0f0f0f] border-[#1a1a1a] text-[#888] hover:bg-[#121212] hover:border-[#2a2a2a]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                
                <ContinueButton />
              </motion.div>
            )}

            {/* STEP 5: Personal Info */}
            {currentStep === 4 && (
              <motion.div key="step4" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="w-full">
                <StepHeader 
                  title="Final step" 
                  subtitle="Where should I send the proposal?" 
                />
                
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest">Full Name <span className="text-[#a1ebd4]">*</span></label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => updateForm("name", e.target.value)}
                        className="w-full bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-3 text-[14px] text-white placeholder-[#444] focus:outline-none focus:border-[#444] focus:bg-[#111] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest">Company (Optional)</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => updateForm("company", e.target.value)}
                        className="w-full bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-3 text-[14px] text-white placeholder-[#444] focus:outline-none focus:border-[#444] focus:bg-[#111] transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest">Email Address <span className="text-[#a1ebd4]">*</span></label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      className="w-full bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-3 text-[14px] text-white placeholder-[#444] focus:outline-none focus:border-[#444] focus:bg-[#111] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest">Phone Number <span className="text-[#a1ebd4]">*</span></label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      className="w-full bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-3 text-[14px] text-white placeholder-[#444] focus:outline-none focus:border-[#444] focus:bg-[#111] transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-10 flex items-center gap-4 border-t border-[#1a1a1a] pt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={!isStepValid() || isLoading}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-black text-[13px] font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#e0e0e0] transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>Submit Proposal</>
                    )}
                  </button>
                  <div className="text-[11px] text-[#555] font-medium flex items-center gap-1.5">
                    press <kbd className="px-1.5 py-0.5 border border-[#333] bg-[#1a1a1a] rounded text-[10px] text-[#888] font-mono">Enter ↵</kbd>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default ProjectRequest;
