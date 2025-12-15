import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';
import { useToast } from '../contexts/ToastContext';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const VALID_EMAIL = 'admin@financehub.com';
  const VALID_PASSWORD = 'password123';

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === 'email') {
      if (!formData.email.trim()) {
        setErrors((prev) => ({ ...prev, email: 'Email is required' }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setErrors((prev) => ({ ...prev, email: 'Please enter a valid email' }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
    }

    if (field === 'password') {
      if (!formData.password) {
        setErrors((prev) => ({ ...prev, password: 'Password is required' }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.password;
          return newErrors;
        });
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const isFieldValid = (field: 'email' | 'password'): boolean => {
    if (field === 'email') {
      return formData.email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && !errors.email;
    }
    if (field === 'password') {
      return formData.password.length > 0 && !errors.password;
    }
    return false;
  };

  const isFormValid =
    formData.email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ email: true, password: true });

    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await fetch(`http://localhost:3001/users?email=${formData.email}`);
      const users = await response.json();

      if (users.length === 0) {
        setErrors({
          email: 'Invalid email or password',
          password: 'Invalid email or password',
        });
        showToast('Invalid credentials', 'error');
        setIsLoading(false);
        return;
      }

      const user = users[0];

      if (user.password !== formData.password) {
        setErrors({
          email: 'Invalid email or password',
          password: 'Invalid email or password',
        });
        showToast('Invalid credentials', 'error');
        setIsLoading(false);
        return;
      }

      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        })
      );

      showToast('Login successful!', 'success');

      // Delay navigation slightly to show success message
      setTimeout(() => {
        navigate('/onboarding');
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      showToast('Login failed. Please try again.', 'error');
      setIsLoading(false);
    }
  };

  const showValidation = (field: string) => touched[field];

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-between">
        <div className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
            <BuildingOffice2Icon className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-xl font-semibold">FinanceHub</span>
        </div>

        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">Enterprise-grade financial management for modern teams</h1>
          <p className="text-blue-100 text-lg">Secure, scalable, and built for multi-tenant organizations.</p>
        </div>

        <div className="text-blue-200 text-sm">2024 FinanceHub. All rights reserved.</div>
      </div>

      {/* Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
              <BuildingOffice2Icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">FinanceHub</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  showValidation('email')
                    ? errors.email
                      ? 'border-red-500'
                      : isFieldValid('email')
                      ? 'border-green-500'
                      : 'border-gray-300'
                    : 'border-gray-300'
                }`}
                placeholder="you@company.com"
              />
              {showValidation('email') && errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⊗</span>
                  {errors.email}
                </p>
              )}
              {showValidation('email') && isFieldValid('email') && !errors.email && (
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                  <span>✓</span>
                  Valid
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  showValidation('password')
                    ? errors.password
                      ? 'border-red-500'
                      : isFieldValid('password')
                      ? 'border-green-500'
                      : 'border-gray-300'
                    : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              {showValidation('password') && errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⊗</span>
                  {errors.password}
                </p>
              )}
              {showValidation('password') && isFieldValid('password') && !errors.password && (
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                  <span>✓</span>
                  Valid
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">Password is required</p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors ${
                isFormValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Sign in →
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Demo credentials:</strong>
              <br />
              Email: admin@financehub.com
              <br />
              Password: password123
            </p>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button className="text-blue-600 hover:text-blue-700 font-medium">Contact your administrator</button>
          </div>
        </div>
      </div>
      {isLoading && <LoadingSpinner message="Signing in..." />}
    </div>
  );
}

export default Login;
