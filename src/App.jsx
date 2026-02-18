import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext';
import StationContent from './components/StationContent';
import Footer from './components/Footer';
import AccessibilityMenu from './components/AccessibilityMenu';
import { TOTAL_STATIONS } from './constants';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract station number from path
  const match = location.pathname.match(/\/station\/(\d+)/);
  const currentStation = match ? parseInt(match[1], 10) : 0;

  // Validate station and redirect if invalid
  useEffect(() => {
    if (location.pathname.startsWith('/station/')) {
      if (isNaN(currentStation) || currentStation < 1 || currentStation > TOTAL_STATIONS) {
        navigate('/', { replace: true });
      }
    }
  }, [location.pathname, currentStation, navigate]);

  const handleNext = () => {
    if (currentStation < TOTAL_STATIONS) {
      navigate(`/station/${currentStation + 1}`);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentStation > 1) {
      navigate(`/station/${currentStation - 1}`);
      window.scrollTo(0, 0);
    } else if (currentStation === 1) {
      navigate('/');
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <main>
        <div id="content-area">
          <Routes>
            <Route path="/" element={<StationContent />} />
            <Route path="/station/:id" element={<StationContent />} />
          </Routes>
        </div>
      </main>

      <Footer
        currentStation={currentStation}
        totalStations={TOTAL_STATIONS}
        onPrev={handlePrev}
        onNext={handleNext}
      />
      <AccessibilityMenu />
    </>
  );
}

function App() {
  return (
    <AccessibilityProvider>
      <AppContent />
    </AccessibilityProvider>
  );
}

export default App;
