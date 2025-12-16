import { useState } from 'react';
import AccordionComponent from './AccordionComponent';
import TenantForm, { type TenantFormData } from './TenantForm';
import OrganizationForm, { type OrganizationFormData } from './OrganizationForm';
import LabelsForm, { type LabelsFormData } from './LabelsForm';
import { BuildingOffice2Icon, BuildingLibraryIcon, TagIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { useToast } from '../contexts/ToastContext';

function OnboardingFlow() {
  const [openSection, setOpenSection] = useState<number>(1);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [tenantData, setTenantData] = useState<TenantFormData | null>(null);
  const [organizationData, setOrganizationData] = useState<OrganizationFormData | null>(null);
  const [labelsData, setLabelsData] = useState<LabelsFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

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

    // Close all sections to show success
    setOpenSection(0);

    if (!tenantData || !organizationData) {
      alert('Please complete all previous sections before submitting');
      return;
    }

    //submitForm(tenantData, organizationData, data);
  };

  const submitForm = async (tenant: TenantFormData, organization: OrganizationFormData, labels: LabelsFormData) => {
    setIsSubmitting(true);
    try {
      const currentUserStr = localStorage.getItem('currentUser');
      if (!currentUserStr) {
        showToast('No user logged in. Please log in again.', 'error');
        navigate('/login');
        return;
      }
      const currentUser = JSON.parse(currentUserStr);
      const submissionData = {
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
        tenant,
        organization,
        labels: labels.labels,
      };
      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
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
      // Show success message
      showToast('Organization created successfully!', 'success');
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (error) {
      console.error('Submission error:', error);
      showToast('Failed to submit form. Please try again.', 'error');
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

          <AccordionComponent
            number={1}
            title="Tenant Configuration"
            description="Configure your tenant settings and environment"
            isOpen={openSection === 1}
            isCompleted={completedSections.includes(1)}
            onToggle={() => toggleSection(1)}
            icon={BuildingOffice2Icon}
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
            icon={BuildingLibraryIcon}
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
            icon={TagIcon}
          >
            <LabelsForm
              onComplete={handleLabelsComplete}
              onValidationFail={() => {
                setCompletedSections((prev) => prev.filter((s) => s !== 3));
              }}
              initialData={labelsData || undefined}
            />
          </AccordionComponent>

          {/* Success Section - Shows inline when all complete */}
          {completedSections.length === 3 && !isSubmitting && (
            <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Onboarding Complete</h2>
              <p className="text-gray-600 mb-6">
                All sections have been completed. You can now proceed to your dashboard.
              </p>
              <button
                onClick={() => {
                  if (tenantData && organizationData && labelsData) {
                    submitForm(tenantData, organizationData, labelsData);
                  }
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
      {isSubmitting && <LoadingSpinner message="Creating your organization..." />}
    </div>
  );
}

export default OnboardingFlow;
