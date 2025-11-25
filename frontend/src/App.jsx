import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import HomePage from './pages/Home';
import StatsPage from './pages/Stats';
import HealthPage from './pages/Health';
import Redirect from './pages/Redirect';

function App() {
  return (
    <Router>
      <Navigation />
      <div className="page-wrapper">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stats/:code" element={<StatsPage />} />
          <Route path="/health" element={<HealthPage />} />
          {/* Catch-all route for short codes - must be last */}
          <Route path="/:code" element={<Redirect />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
