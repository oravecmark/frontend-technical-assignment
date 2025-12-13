import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface OrganizationFormProps {
  onContinue: (data: OrganizationFormData) => void;
  onValidationFail?: () => void;
  initialData?: OrganizationFormData;
}

export interface OrganizationFormData {
  organizationName: string;
  legalEntityName: string;
  registrationNumber: string;
  industry: string;
  numberOfEmployees: string;
  annualRevenue: string;
  country: string;
  businessAddress: string;
}

function OrganizationForm({ onContinue, onValidationFail, initialData }: OrganizationFormProps) {
  const [formData, setFormData] = useState<OrganizationFormData>(
    initialData || {
      organizationName: '',
      legalEntityName: '',
      registrationNumber: '',
      industry: '',
      numberOfEmployees: '',
      annualRevenue: '',
      country: '',
      businessAddress: '',
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: keyof OrganizationFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (
      (field === 'organizationName' || field === 'legalEntityName' || field === 'industry' || field === 'country') &&
      !formData[field].trim()
    ) {
      const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
      setErrors((prev) => ({
        ...prev,
        [field]: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`,
      }));
    }
    // Validate to contain numbers and spaces only
    else if (field === 'annualRevenue' && formData.annualRevenue.trim() && !/^[\d\s]+$/.test(formData.annualRevenue)) {
      setErrors((prev) => ({
        ...prev,
        [field]: 'Revenue must contain only numbers',
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const isFieldValid = (field: keyof OrganizationFormData): boolean => {
    const value = formData[field];
    if (field === 'annualRevenue') {
      return value.trim().length > 0 && /^[\d\s]+$/.test(value) && !errors[field];
    }
    return value.trim().length > 0 && !errors[field];
  };

  const isFormValid =
    formData.organizationName.trim().length > 0 &&
    formData.legalEntityName.trim().length > 0 &&
    formData.industry.length > 0 &&
    formData.country.length > 0;

  const { data: industries, isLoading: loadingIndustries } = useQuery({
    queryKey: ['industries'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/industry');
      return res.json();
    },
  });

  const { data: employeeRanges, isLoading: loadingEmployees } = useQuery({
    queryKey: ['employeeRanges'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/number-of-employees');
      return res.json();
    },
  });

  const { data: countries, isLoading: loadingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/country');
      return res.json();
    },
  });

  const handleChange = (field: keyof OrganizationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }
    if (!formData.legalEntityName.trim()) {
      newErrors.legalEntityName = 'Legal entity name is required';
    }
    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }
    if (!formData.country) {
      newErrors.country = 'Please select a country';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      organizationName: true,
      legalEntityName: true,
      industry: true,
      country: true,
    });

    if (validate()) {
      // Trim whitespace from revenue before submitting
      const cleanedData = {
        ...formData,
        annualRevenue: formData.annualRevenue.replace(/\s/g, ''),
      };
      onContinue(cleanedData);
    } else {
      onValidationFail?.();
    }
  };

  const showValidation = (field: string) => touched[field];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Organization Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.organizationName}
            onChange={(e) => handleChange('organizationName', e.target.value)}
            onBlur={() => handleBlur('organizationName')}
            className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              showValidation('organizationName')
                ? errors.organizationName
                  ? 'border-red-500'
                  : isFieldValid('organizationName')
                  ? 'border-green-500'
                  : 'border-gray-300'
                : 'border-gray-300'
            }`}
            placeholder="Acme Inc."
          />
          {showValidation('organizationName') && errors.organizationName && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span>⊗</span>
              {errors.organizationName}
            </p>
          )}
          {showValidation('organizationName') && isFieldValid('organizationName') && !errors.organizationName && (
            <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
              <span>✓</span>
              Valid
            </p>
          )}
        </div>

        {/* Legal Entity Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Legal Entity Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.legalEntityName}
            onChange={(e) => handleChange('legalEntityName', e.target.value)}
            onBlur={() => handleBlur('legalEntityName')}
            className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              showValidation('legalEntityName')
                ? errors.legalEntityName
                  ? 'border-red-500'
                  : isFieldValid('legalEntityName')
                  ? 'border-green-500'
                  : 'border-gray-300'
                : 'border-gray-300'
            }`}
            placeholder="Acme Incorporated LLC"
          />
          {showValidation('legalEntityName') && errors.legalEntityName && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span>⊗</span>
              {errors.legalEntityName}
            </p>
          )}
          {showValidation('legalEntityName') && isFieldValid('legalEntityName') && !errors.legalEntityName && (
            <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
              <span>✓</span>
              Valid
            </p>
          )}
        </div>

        {/* Registration Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
          <input
            type="text"
            value={formData.registrationNumber}
            onChange={(e) => handleChange('registrationNumber', e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="12-3456789"
          />
          <p className="text-xs text-gray-500 mt-1">EIN, VAT, or company registration number</p>
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.industry}
            onChange={(e) => handleChange('industry', e.target.value)}
            onBlur={() => handleBlur('industry')}
            className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              showValidation('industry')
                ? errors.industry
                  ? 'border-red-500'
                  : isFieldValid('industry')
                  ? 'border-green-500'
                  : 'border-gray-300'
                : 'border-gray-300'
            }`}
            disabled={loadingIndustries}
          >
            <option value="">Select industry</option>
            {industries?.map((industry: any) => (
              <option key={industry.id} value={industry.id}>
                {industry.name}
              </option>
            ))}
          </select>
          {showValidation('industry') && errors.industry && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span>⊗</span>
              {errors.industry}
            </p>
          )}
          {showValidation('industry') && isFieldValid('industry') && !errors.industry && (
            <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
              <span>✓</span>
              Valid
            </p>
          )}
        </div>

        {/* Number of Employees */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
          <select
            value={formData.numberOfEmployees}
            onChange={(e) => handleChange('numberOfEmployees', e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loadingEmployees}
          >
            <option value="">Select range</option>
            {employeeRanges?.map((range: any) => (
              <option key={range.id} value={range.id}>
                {range.name}
              </option>
            ))}
          </select>
        </div>

        {/* Annual Revenue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Annual Revenue (USD)</label>
          <input
            type="text"
            value={formData.annualRevenue}
            onChange={(e) => handleChange('annualRevenue', e.target.value)}
            onBlur={() => handleBlur('annualRevenue')}
            className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              showValidation('annualRevenue')
                ? errors.annualRevenue
                  ? 'border-red-500'
                  : isFieldValid('annualRevenue')
                  ? 'border-green-500'
                  : 'border-gray-300'
                : 'border-gray-300'
            }`}
            placeholder="1000000"
          />
          {showValidation('annualRevenue') && errors.annualRevenue && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span>⊗</span>
              {errors.annualRevenue}
            </p>
          )}
          {showValidation('annualRevenue') && isFieldValid('annualRevenue') && !errors.annualRevenue && (
            <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
              <span>✓</span>
              Valid
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">Numbers only (spaces allowed)</p>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            onBlur={() => handleBlur('country')}
            className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              showValidation('country')
                ? errors.country
                  ? 'border-red-500'
                  : isFieldValid('country')
                  ? 'border-green-500'
                  : 'border-gray-300'
                : 'border-gray-300'
            }`}
            disabled={loadingCountries}
          >
            <option value="">Select country</option>
            {countries?.map((country: any) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          {showValidation('country') && errors.country && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span>⊗</span>
              {errors.country}
            </p>
          )}
          {showValidation('country') && isFieldValid('country') && !errors.country && (
            <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
              <span>✓</span>
              Valid
            </p>
          )}
        </div>

        {/* Business Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
          <input
            type="text"
            value={formData.businessAddress}
            onChange={(e) => handleChange('businessAddress', e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123 Financial District, Suite 100"
          />
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={!isFormValid}
          className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors ${
            isFormValid
              ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </form>
  );
}

export default OrganizationForm;
