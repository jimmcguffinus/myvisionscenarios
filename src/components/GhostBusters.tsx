import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function GhostBusters() {
  const [timestamp, setTimestamp] = useState(new Date().toISOString())
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date().toISOString())
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-6 text-green-500">
          🚫👻 GHOSTBUSTERS EDITION 👻🚫
        </h1>
        
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-8 mb-8">
          <p className="text-xl mb-4">
            This is the cache-busting version of the app. If you're seeing this page, 
            the deployment was successful!
          </p>
          
          <p className="text-green-400 font-mono text-sm mb-6">
            Build Timestamp: {timestamp}
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <Link 
              to="/"
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-md transition-colors font-medium shadow-md"
            >
              Return to Main App
            </Link>
          </div>
        </div>
        
        <div className="text-gray-400 mt-8">
          <p className="italic">
            "Who ya gonna call? GHOSTBUSTERS!"
          </p>
        </div>
      </div>
    </div>
  )
}

export default GhostBusters 