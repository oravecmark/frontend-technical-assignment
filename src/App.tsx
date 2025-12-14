import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import OnboardingFlow from './components/OnboardingFlow';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<OnboardingFlow />} />
    </Routes>
  );
}

export default App;
