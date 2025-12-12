import { useState } from 'react';
import AccordionComponent from './AccordionComponent';
import TenantForm, { type TenantFormData } from './TenantForm';
import OrganizationForm, { type OrganizationFormData } from './OrganizationForm';
import LabelsForm, { type LabelsFormData } from './LabelsForm';
import SuccessScreen from './SuccessScreen';

function OnboardingFlow() {
  const [openSection, setOpenSection] = useState<number>(1);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [tenantData, setTenantData] = useState<TenantFormData | null>(null);
  const [organizationData, setOrganizationData] = useState<OrganizationFormData | null>(null);
  const [labelsData, setLabelsData] = useState<LabelsFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const toggleSection = (section: number) => {
    setOpenSection(openSection === section ? 0 : section);
  };

  const handleTenantContinue = (data: TenantFormData) => {
    setTenantData(data);
    setCompletedSections((prev) => [...prev, 1]);
    setOpenSection(2);
  };

  const handleOrganizationContinue = (data: OrganizationFormData) => {
    setOrganizationData(data);
    setCompletedSections((prev) => [...prev, 2]);
    setOpenSection(3);
  };

  const handleLabelsComplete = (data: LabelsFormData) => {
    setLabelsData(data);

    if (!completedSections.includes(3)) {
      setCompletedSections((prev) => [...prev, 3]);
    }

    if (!tenantData || !organizationData) {
      alert('Please complete all previous sections before submitting');
      return;
    }

    submitForm(tenantData, organizationData, data);
  };

  const submitForm = async (tenant: TenantFormData, organization: OrganizationFormData, labels: LabelsFormData) => {
    setIsSubmitting(true);

    try {
      const submissionData = {
        tenant,
        organization,
        labels: labels.labels,
      };

      const response = await fetch('http://localhost:3001/submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setIsComplete(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (completedSections.length / 3) * 100;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Organization Onboarding</h1>
          <p className="text-gray-600 mb-8">
            Complete the following sections to set up your organization on the platform.
          </p>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Onboarding Progress</span>
              <span className="text-sm text-gray-500">{completedSections.length} of 3 completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {isComplete && (
            <div className="mb-6">
              <SuccessScreen />
            </div>
          )}

          {isSubmitting && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-700">Submitting your information...</p>
            </div>
          )}

          <AccordionComponent
            number={1}
            title="Tenant Configuration"
            description="Configure your tenant settings and environment"
            isOpen={openSection === 1}
            isCompleted={completedSections.includes(1)}
            onToggle={() => toggleSection(1)}
          >
            <TenantForm
              onContinue={handleTenantContinue}
              onValidationFail={() => {
                setCompletedSections((prev) => prev.filter((s) => s !== 1));
              }}
              initialData={tenantData || undefined}
            />
          </AccordionComponent>

          <AccordionComponent
            number={2}
            title="Organization Details"
            description="Set up your organization profile and business information"
            isOpen={openSection === 2}
            isCompleted={completedSections.includes(2)}
            onToggle={() => toggleSection(2)}
          >
            <OrganizationForm
              onContinue={handleOrganizationContinue}
              onValidationFail={() => {
                setCompletedSections((prev) => prev.filter((s) => s !== 2));
              }}
              initialData={organizationData || undefined}
            />
          </AccordionComponent>

          <AccordionComponent
            number={3}
            title="Labels & Categories"
            description="Define labels for organizing accounts and transactions"
            isOpen={openSection === 3}
            isCompleted={completedSections.includes(3)}
            onToggle={() => toggleSection(3)}
          >
            <LabelsForm
              onComplete={handleLabelsComplete}
              onValidationFail={() => {
                setCompletedSections((prev) => prev.filter((s) => s !== 3));
              }}
              initialData={labelsData || undefined}
            />
          </AccordionComponent>
        </div>
      </div>
    </div>
  );
}

export default OnboardingFlow;
