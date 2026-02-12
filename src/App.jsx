import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import StationContent from './components/StationContent';
import Footer from './components/Footer';

function AppContent() {
  const totalStations = 14;
  const location = useLocation();
  const navigate = useNavigate();

  // Extract station number from path
  const match = location.pathname.match(/\/station\/(\d+)/);
  const currentStation = match ? parseInt(match[1], 10) : 0;

  const handleNext = () => {
    if (currentStation < totalStations) {
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
        totalStations={totalStations}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
