import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  BuildingOffice2Icon,
  BuildingLibraryIcon,
  TagIcon,
  Squares2X2Icon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useToast } from '../contexts/ToastContext';
import LoadingSpinner from './LoadingSpinner';

function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [selectedOrgIndex, setSelectedOrgIndex] = useState(0);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);

  // Get current user from localStorage
  const currentUserStr = localStorage.getItem('currentUser');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  // Redirect to login if no user
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOrgDropdownOpen) {
        setIsOrgDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOrgDropdownOpen]);

  // Fetch user's submissions
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['submissions', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      const res = await fetch(`http://localhost:3001/submission?userId=${currentUser.id}`);
      return res.json();
    },
    enabled: !!currentUser,
  });

  // Fetch reference data to map IDs to names
  const { data: environments } = useQuery({
    queryKey: ['environments'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/environment');
      return res.json();
    },
  });

  const { data: regions } = useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/region');
      return res.json();
    },
  });

  const { data: industries } = useQuery({
    queryKey: ['industries'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/industry');
      return res.json();
    },
  });

  const { data: countries } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/country');
      return res.json();
    },
  });

  // Get the most recent submission
  const latestSubmission = submissions && submissions.length > 0 ? submissions[selectedOrgIndex] : null;

  // Helper functions to get names from IDs
  const getEnvironmentName = (id: string) => {
    const env = environments?.find((e: any) => e.id === id);
    return env?.name || id;
  };

  const getRegionName = (id: string) => {
    const region = regions?.find((r: any) => r.id === id);
    return region?.name || id;
  };

  const getIndustryName = (id: string) => {
    const industry = industries?.find((i: any) => i.id === id);
    return industry?.name || id;
  };

  const getCountryName = (id: string) => {
    const country = countries?.find((c: any) => c.id === id);
    return country?.name || id;
  };

  // Get initial from organization name
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  if (!currentUser) {
    return null; // Will redirect to login
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!latestSubmission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Organization Found</h2>
          <p className="text-gray-600 mb-6">You haven't completed onboarding yet.</p>
          <button
            onClick={() => navigate('/onboarding')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Start Onboarding
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    localStorage.removeItem('currentUser');
    showToast('Logged out successfully', 'success');

    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
              <BuildingOffice2Icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">FinanceHub</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-md font-medium text-left">
              <Squares2X2Icon className="w-5 h-5" />
              Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md text-left">
              <BuildingStorefrontIcon className="w-5 h-5" />
              Tenants
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md text-left">
              <TagIcon className="w-5 h-5" />
              Labels
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md text-left">
              <BuildingLibraryIcon className="w-5 h-5" />
              Organizations
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md text-left">
              <UserGroupIcon className="w-5 h-5" />
              Users
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md text-left">
              <Cog6ToothIcon className="w-5 h-5" />
              Settings
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-left font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 relative">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-semibold text-sm">
                  {getInitial(latestSubmission.organization.organizationName)}
                </div>

                {/* Dropdown Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOrgDropdownOpen(!isOrgDropdownOpen);
                  }}
                  className="flex items-center gap-2 font-medium text-gray-900 hover:text-gray-700 transition-colors"
                >
                  <span
                    className="truncate w-[200px] inline-block text-left"
                    title={latestSubmission.organization.organizationName}
                  >
                    {latestSubmission.organization.organizationName}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform flex-shrink-0 ${isOrgDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isOrgDropdownOpen && submissions && submissions.length > 1 && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-500 px-3 py-2">Switch Organization</div>
                      {submissions.map((submission: any, index: number) => (
                        <button
                          key={submission.id || index}
                          onClick={() => {
                            setSelectedOrgIndex(index);
                            setIsOrgDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                            index === selectedOrgIndex ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded flex items-center justify-center text-sm font-semibold ${
                              index === selectedOrgIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {getInitial(submission.organization.organizationName)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{submission.organization.organizationName}</div>
                            <div className="text-xs text-gray-500">
                              {getIndustryName(submission.organization.industry)}
                            </div>
                          </div>
                          {index === selectedOrgIndex && (
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-600">Production</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">{currentUser.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{currentUser.name}</div>
                  <div className="text-gray-500">{currentUser.role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">
                Overview for {latestSubmission.organization.organizationName} / Production
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                title="Onboarding completed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Onboarding Complete</span>
              </div>
              <button
                onClick={() => navigate('/onboarding')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Organization
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Total Organizations</h3>
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <BuildingLibraryIcon className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{submissions?.length || 0}</div>
              <p className="text-sm text-gray-500">Organizations created</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Tenant</h3>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <BuildingOffice2Icon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div
                className="text-2xl font-bold text-gray-900 mb-1 truncate"
                title={latestSubmission.tenant.tenantName}
              >
                {latestSubmission.tenant.tenantName}
              </div>
              <p className="text-sm text-gray-500">
                {getEnvironmentName(latestSubmission.tenant.environment)} •{' '}
                {getRegionName(latestSubmission.tenant.dataRegion)}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Organization</h3>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <BuildingLibraryIcon className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">Active</div>
              <p className="text-sm text-gray-500">{getIndustryName(latestSubmission.organization.industry)}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Active Labels</h3>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <TagIcon className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{latestSubmission.labels.length}</div>
              <p className="text-sm text-gray-500">Categories configured</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Legal Name</span>
                  <span className="text-sm font-medium text-gray-900">
                    {latestSubmission.organization.legalEntityName}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Industry</span>
                  <span className="text-sm font-medium text-gray-900">
                    {getIndustryName(latestSubmission.organization.industry)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Country</span>
                  <span className="text-sm font-medium text-gray-900">
                    {getCountryName(latestSubmission.organization.country)}
                  </span>
                </div>
                {latestSubmission.organization.registrationNumber && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Registration Number</span>
                    <span className="text-sm font-medium text-gray-900">
                      {latestSubmission.organization.registrationNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Labels</h3>
              {latestSubmission.labels.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {latestSubmission.labels.map((label: any) => (
                    <div
                      key={label.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200"
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: label.color }} />
                      <span>{label.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No labels configured</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {isLoggingOut && <LoadingSpinner message="Logging out..." />}
    </div>
  );
}

export default Dashboard;
