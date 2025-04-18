// src/components/Layout.tsx - CLEANED + Visual Timestamp
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout() {
  // Visual Timestamp
  const deploymentTimestamp = "2025-04-22_T22:15Z"; // <<< UPDATE THIS MANUALLY >>>

  return (
    <div className="min-h-screen bg-[#022d17] text-[#d9c7f0] p-4">
      <ToastContainer position="top-right" theme="colored" />
      <header className="mb-6">
         <h1 className="text-4xl font-extrabold text-[#b48ead]">
           Vision Scenarios (TOC Layout)
         </h1>
         {/* Display Timestamp */}
         <p className="text-xs text-[#a5a0b3] mt-1">Deployed: {deploymentTimestamp}</p>
         <nav className="mt-2 border-b border-[#5e4b8b] pb-2">
            <span className="mr-4 text-[#a5a0b3]">Nav Placeholder:</span>
         </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}