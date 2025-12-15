import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface TenantFormProps {
  onContinue: (data: TenantFormData) => void;
  onValidationFail?: () => void;
  initialData?: TenantFormData;
}

export interface TenantFormData {
  tenantName: string;
  tenantIdentifier: string;
  environment: string;
  dataRegion: string;
  multiCurrency: boolean;
}

function TenantForm({ onContinue, onValidationFail, initialData }: TenantFormProps) {
  const [formData, setFormData] = useState<TenantFormData>(
    initialData || {
      tenantName: '',
      tenantIdentifier: '',
      environment: '',
      dataRegion: '',
      multiCurrency: false,
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: keyof TenantFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const value = formData[field];
    if (typeof value === 'string' && !value.trim()) {
      const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
      setErrors((prev) => ({
        ...prev,
        [field]: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`,
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Single field validation
  const isFieldValid = (field: keyof TenantFormData): boolean => {
    const value = formData[field];
    if (typeof value === 'boolean') return true;
    return value.trim().length > 0 && !errors[field];
  };

  // Check if the whole form is valid
  const isFormValid =
    formData.tenantName.trim().length > 0 &&
    formData.tenantIdentifier.trim().length > 0 &&
    formData.environment.length > 0 &&
    formData.dataRegion.length > 0;

  const { data: environments, isLoading: loadingEnv } = useQuery({
    queryKey: ['environments'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/environment');
      return res.json();
    },
  });

  const { data: regions, isLoading: loadingRegions } = useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/region');
      return res.json();
    },
  });

  const handleChange = (field: keyof TenantFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tenantName.trim()) {
      newErrors.tenantName = 'Tenant name is required';
    }
    if (!formData.tenantIdentifier.trim()) {
      newErrors.tenantIdentifier = 'Tenant identifier is required';
    }
    if (!formData.environment) {
      newErrors.environment = 'Please select an environment';
    }
    if (!formData.dataRegion) {
      newErrors.dataRegion = 'Please select a data region';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      tenantName: true,
      tenantIdentifier: true,
      environment: true,
      dataRegion: true,
    });

    if (validate()) {
      onContinue(formData);
    } else {
      onValidationFail?.();
    }
  };

  const showValidation = (field: string) => touched[field];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Tenant Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tenant Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.tenantName}
            onChange={(e) => handleChange('tenantName', e.target.value)}
            onBlur={() => handleBlur('tenantName')}
            maxLength={60}
            className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              showValidation('tenantName')
                ? errors.tenantName
                  ? 'border-red-500'
                  : isFieldValid('tenantName')
                  ? 'border-green-500'
                  : 'border-gray-300'
                : 'border-gray-300'
            }`}
            placeholder="Acme Corporation"
          />
          {showValidation('tenantName') && errors.tenantName && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span>⊗</span>
              {errors.tenantName}
            </p>
          )}
          {showValidation('tenantName') && isFieldValid('tenantName') && !errors.tenantName && (
            <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
              <span>✓</span>
              Valid
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">The display name for your tenant</p>
        </div>

        {/* Tenant ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tenant Identifier <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.tenantIdentifier}
            onChange={(e) => handleChange('tenantIdentifier', e.target.value)}
            onBlur={() => handleBlur('tenantIdentifier')}
            maxLength={50}
            className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              showValidation('tenantIdentifier')
                ? errors.tenantIdentifier
                  ? 'border-red-500'
                  : isFieldValid('tenantIdentifier')
                  ? 'border-green-500'
                  : 'border-gray-300'
                : 'border-gray-300'
            }`}
            placeholder="acme-corp"
          />
          {showValidation('tenantIdentifier') && errors.tenantIdentifier && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span>⊗</span>
              {errors.tenantIdentifier}
            </p>
          )}
          {showValidation('tenantIdentifier') && isFieldValid('tenantIdentifier') && !errors.tenantIdentifier && (
            <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
              <span>✓</span>
              Valid
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">Unique URL-safe identifier</p>
        </div>

        {/* Environment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Environment <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.environment}
            onChange={(e) => handleChange('environment', e.target.value)}
            onBlur={() => handleBlur('environment')}
            className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              showValidation('environment')
                ? errors.environment
                  ? 'border-red-500'
                  : isFieldValid('environment')
                  ? 'border-green-500'
                  : 'border-gray-300'
                : 'border-gray-300'
            }`}
            disabled={loadingEnv}
          >
            <option value="">Select environment</option>
            {environments?.map((env: any) => (
              <option key={env.id} value={env.id}>
                {env.name}
              </option>
            ))}
          </select>
          {showValidation('environment') && errors.environment && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span>⊗</span>
              {errors.environment}
            </p>
          )}
          {showValidation('environment') && isFieldValid('environment') && !errors.environment && (
            <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
              <span>✓</span>
              Valid
            </p>
          )}
        </div>

        {/* Data Region */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Region <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.dataRegion}
            onChange={(e) => handleChange('dataRegion', e.target.value)}
            onBlur={() => handleBlur('dataRegion')}
            className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              showValidation('dataRegion')
                ? errors.dataRegion
                  ? 'border-red-500'
                  : isFieldValid('dataRegion')
                  ? 'border-green-500'
                  : 'border-gray-300'
                : 'border-gray-300'
            }`}
            disabled={loadingRegions}
          >
            <option value="">Select region</option>
            {regions?.map((region: any) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
          {showValidation('dataRegion') && errors.dataRegion && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span>⊗</span>
              {errors.dataRegion}
            </p>
          )}
          {showValidation('dataRegion') && isFieldValid('dataRegion') && !errors.dataRegion && (
            <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
              <span>✓</span>
              Valid
            </p>
          )}
        </div>
      </div>

      {/* Multi-Currency Support */}
      <div className="bg-gray-50 p-4 rounded-md">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.multiCurrency}
            onChange={(e) => handleChange('multiCurrency', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div>
            <span className="font-medium text-gray-900">Multi-Currency Support</span>
            <p className="text-sm text-gray-500">Enable support for multiple currencies across accounts</p>
          </div>
        </label>
      </div>

      {/* Continue btn */}
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

export default TenantForm;
