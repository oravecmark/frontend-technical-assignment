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

  // Fetch industries from API
  const { data: industries, isLoading: loadingIndustries } = useQuery({
    queryKey: ['industries'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/industry');
      return res.json();
    },
  });

  // Fetch employee ranges from API
  const { data: employeeRanges, isLoading: loadingEmployees } = useQuery({
    queryKey: ['employeeRanges'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/number-of-employees');
      return res.json();
    },
  });

  // Fetch countries from API
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
    if (validate()) {
      onContinue(formData);
    } else {
      onValidationFail?.();
    }
  };

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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.organizationName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Acme Inc."
          />
          {errors.organizationName && <p className="text-red-500 text-sm mt-1">{errors.organizationName}</p>}
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.legalEntityName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Acme Incorporated LLC"
          />
          {errors.legalEntityName && <p className="text-red-500 text-sm mt-1">{errors.legalEntityName}</p>}
        </div>

        {/* Registration Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
          <input
            type="text"
            value={formData.registrationNumber}
            onChange={(e) => handleChange('registrationNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.industry ? 'border-red-500' : 'border-gray-300'
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
          {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
        </div>

        {/* Number of Employees */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
          <select
            value={formData.numberOfEmployees}
            onChange={(e) => handleChange('numberOfEmployees', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1000000"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.country ? 'border-red-500' : 'border-gray-300'
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
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>

        {/* Business Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
          <input
            type="text"
            value={formData.businessAddress}
            onChange={(e) => handleChange('businessAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123 Financial District, Suite 100"
          />
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Continue
        </button>
      </div>
    </form>
  );
}

export default OrganizationForm;
