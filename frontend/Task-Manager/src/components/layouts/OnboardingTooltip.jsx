import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { LuX, LuArrowRight, LuArrowLeft } from "react-icons/lu";

const STEPS = [
  {
    title: "Welcome to Task Manager! 👋",
    description: "Let's take a quick tour so you can get started right away.",
    position: "center",
  },
  {
    title: "Your Workspace",
    description:
      "The workspace switcher in the navbar lets you create and switch between isolated project environments. Each workspace has its own tasks and members.",
    position: "center",
  },
  {
    title: "Create Tasks",
    description:
      "Use 'Create Task' in the sidebar to create tasks, assign them to team members, set priorities and due dates, and even add a sticky note for your team.",
    position: "center",
  },
  {
    title: "Manage Your Team",
    description:
      "Head to 'Team Members' to see all members in your workspace, track their task progress, and write private sticky notes about them.",
    position: "center",
  },
  {
    title: "Dark & Light Mode",
    description:
      "Use the toggle in the top right to switch between dark and light mode. Your preference is saved automatically.",
    position: "center",
  },
  {
    title: "You're all set! 🚀",
    description:
      "Start by creating your first task. If you need to invite team members, use the workspace invite option in the navbar.",
    position: "center",
  },
];

const OnboardingTooltip = () => {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("onboardingSeen");
    if (!seen) {
      setTimeout(() => setVisible(true), 1000);
    }
  }, []);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleClose = () => {
    localStorage.setItem("onboardingSeen", "true");
    setVisible(false);
  };

  if (!visible) return null;

  const current = STEPS[step];

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in">
        {/* Progress dots */}
        <div className="flex gap-1.5 mb-5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === step ? "24px" : "6px",
                backgroundColor: i === step ? "#1368EC" : "#e2e8f0",
              }}
            />
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <LuX className="text-lg" />
        </button>

        {/* Step indicator */}
        <p className="text-xs text-blue-500 font-medium mb-2">
          Step {step + 1} of {STEPS.length}
        </p>

        {/* Content */}
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          {current.title}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          {current.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleClose}
            className="text-xs text-gray-400 hover:text-gray-600 transition underline"
          >
            Skip tour
          </button>

          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                <LuArrowLeft className="text-sm" /> Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              {step === STEPS.length - 1 ? "Get Started!" : "Next"}
              {step < STEPS.length - 1 && <LuArrowRight className="text-sm" />}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default OnboardingTooltip;
