// src/App.tsx - ULTRA SIMPLE TEST VERSION
import React from 'react';

function App() {
  const timestamp = new Date().toISOString();
  
  return (
    <div style={{ 
      backgroundColor: '#022d17', 
      color: '#d9c7f0', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        color: '#b48ead',
        marginBottom: '1rem'
      }}>
        Hello Ghostbusters!
      </h1>
      
      <p style={{ 
        fontSize: '1.5rem', 
        marginBottom: '2rem',
        color: '#a5a0b3'
      }}>
        This is a test page to verify cache busting and deployment
      </p>
      
      <div style={{
        backgroundColor: '#043119',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #5e4b8b',
        marginBottom: '2rem',
        width: '100%',
        maxWidth: '600px'
      }}>
        <h2 style={{ color: '#cbb9f5', marginBottom: '1rem' }}>
          Cache Busting Test
        </h2>
        <p>
          If you're seeing this page, the deployment was successful!
        </p>
        <p>
          <strong>Build Timestamp:</strong> {timestamp}
        </p>
      </div>
      
      <div style={{
        backgroundColor: '#043119',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #5e4b8b',
        width: '100%',
        maxWidth: '600px'
      }}>
        <h2 style={{ color: '#cbb9f5', marginBottom: '1rem' }}>
          WhirlwindVibing Status
        </h2>
        <p>
          The WhirlwindVibing workflow is ready to rock with:
        </p>
        <ul style={{ 
          textAlign: 'left', 
          lineHeight: '1.6',
          listStyleType: 'none',
          padding: '0',
          margin: '1rem 0'
        }}>
          <li>✅ <code>@tailwindcss/postcss</code> in postcss.config.js</li>
          <li>✅ shadcn-ui paths in tailwind.config.js</li>
          <li>✅ Clean index.html without version parameter</li>
          <li>✅ No router dependencies in this test page</li>
        </ul>
      </div>
    </div>
  );
}

export default App;