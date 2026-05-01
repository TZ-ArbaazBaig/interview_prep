import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Practice from './pages/Practice';
import MockInterview from './pages/MockInterview';
import History from './pages/History';
import Results from './pages/Results';
import Chat from './pages/Chat';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - sign in and sign up */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
        
        {/* All other routes are protected */}
        <Route path="/*" element={
          <>
            <SignedIn>
              <div className="min-h-screen bg-obsidian-950 font-sans">
                <Navbar />
                <main className="relative">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/practice/:sessionId" element={<Practice />} />
                    <Route path="/mock/:sessionId" element={<MockInterview />} />
                    <Route path="/results/:sessionId" element={<Results />} />
                    <Route path="/chat/:sessionId" element={<Chat />} />
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
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn 
                signInFallbackRedirectUrl="/sign-in"
                signInForceRedirectUrl="/"
              />
            </SignedOut>
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
