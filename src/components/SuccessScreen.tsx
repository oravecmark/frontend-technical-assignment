function SuccessScreen() {
  return (
    <div className="bg-gray-50 rounded-lg p-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Onboarding Complete</h2>

      <p className="text-gray-600 mb-8">All sections have been completed. You can now proceed to your dashboard.</p>

      <button
        onClick={() => alert('Dashboard feature coming soon!')}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
      >
        Go to Dashboard
      </button>
    </div>
  );
}

export default SuccessScreen;
