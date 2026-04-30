import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Practice from './pages/Practice';
import MockInterview from './pages/MockInterview';
import History from './pages/History';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 font-sans selection:bg-primary-500/30 selection:text-primary-200">
        <Navbar />
        <main className="relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/practice/:sessionId" element={<Practice />} />
            <Route path="/mock/:sessionId" element={<MockInterview />} />
            <Route path="/results/:sessionId" element={<Results />} />
            {/* Catch-all for 404 */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
                <h1 className="text-6xl font-black text-slate-800 mb-4">404</h1>
                <h2 className="text-2xl font-bold text-slate-100 mb-8">Page Not Found</h2>
                <a href="/" className="px-6 py-3 rounded-xl bg-primary-600 text-white font-medium">Go Home</a>
              </div>
            } />
          </Routes>
        </main>
        
        {/* Global Footer */}
        <footer className="border-t border-slate-900 py-12 mt-20">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} InterviewPrep AI. Built for developers by developers.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
