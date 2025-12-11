import { useState } from "react";
import AccordionComponent from "./AccordionComponent";

function OnboardingFlow() {
  const [openSection, setOpenSection] = useState<number>(1);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const toggleSection = (section: number) => {
    setOpenSection(openSection === section ? 0 : section);
  };

  const progress = (completedSections.length / 3) * 100;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Organization Onboarding
          </h1>
          <p className="text-gray-600 mb-8">
            Complete the following sections to set up your organization on the
            platform.
          </p>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Onboarding Progress
              </span>
              <span className="text-sm text-gray-500">
                {completedSections.length} of 3 completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <AccordionComponent
            number={1}
            title="Tenant Configuration"
            description="Configure your tenant settings and environment"
            isOpen={openSection === 1}
            isCompleted={completedSections.includes(1)}
            onToggle={() => toggleSection(1)}
          >
            <p className="text-gray-600">Tenant here</p>
          </AccordionComponent>

          <AccordionComponent
            number={2}
            title="Organization Details"
            description="Set up your organization profile and business information"
            isOpen={openSection === 2}
            isCompleted={completedSections.includes(2)}
            onToggle={() => toggleSection(2)}
          >
            <p className="text-gray-600">Organization form</p>
          </AccordionComponent>

          <AccordionComponent
            number={3}
            title="Labels & Categories"
            description="Define labels for organizing accounts and transactions"
            isOpen={openSection === 3}
            isCompleted={completedSections.includes(3)}
            onToggle={() => toggleSection(3)}
          >
            <p className="text-gray-600">Labels</p>
          </AccordionComponent>
        </div>
      </div>
    </div>
  );
}

export default OnboardingFlow;
