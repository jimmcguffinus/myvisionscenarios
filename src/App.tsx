// src/App.tsx - CLEANED - Router Definition Only
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScenarioListPage from './pages/ScenarioListPage';

function App() {
  // No console logs needed here
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ScenarioListPage />} />
        {/* Other routes */}
      </Route>
    </Routes>
  );
}

export default App;