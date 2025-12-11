function OnboardingFlow() {
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
              <span className="text-sm text-gray-500">0 of 3 completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: "0%" }}
              ></div>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-8">
            Sections will go here...
          </p>
        </div>
      </div>
    </div>
  );
}

export default OnboardingFlow;
