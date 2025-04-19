// src/App.tsx - Remove unused import

// import React from 'react'; // DELETE or COMMENT OUT this line

import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScenarioListPage from './pages/ScenarioListPage';

function App() {
  // console.log("App Router Initializing"); // Keep this commented unless needed
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