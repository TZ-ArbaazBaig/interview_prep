import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Missing Clerk publishable key in .env');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#8F00FF',
          colorBackground: '#0A0A0A',
          colorInputBackground: '#121212',
          colorInputText: '#F1F5F9',
          colorTextOnPrimaryBackground: '#FFFFFF',
          borderRadius: '2px',
          fontFamily: 'Inter, sans-serif',
          fontFamilyButtons: 'Space Grotesk, sans-serif'
        },
        elements: {
          card: "bg-obsidian-900/60 backdrop-blur-xl border border-obsidian-800 shadow-2xl",
          navbar: "hidden",
          headerTitle: "text-2xl font-display font-black tracking-tighter uppercase",
          headerSubtitle: "text-silver-400 font-medium",
          socialButtonsBlockButton: "bg-obsidian-800 border-obsidian-700 hover:bg-obsidian-700 transition-all duration-500",
          socialButtonsBlockButtonText: "font-mono font-bold uppercase tracking-widest text-[10px]",
          formButtonPrimary: "bg-violet-500 hover:bg-violet-600 transition-all duration-500 font-display font-black uppercase tracking-widest text-xs py-3",
          formFieldLabel: "text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-silver-500",
          footerActionText: "text-silver-500 font-medium",
          footerActionLink: "text-violet-400 hover:text-violet-300 transition-colors font-bold",
          identityPreviewText: "text-silver-200",
          identityPreviewEditButtonIcon: "text-violet-500",
          formFieldErrorText: "text-rose-400 font-mono text-[9px] uppercase tracking-widest mt-1",
          formFieldInput__error: "border-rose-500/50 bg-rose-500/5",
          alert: "bg-rose-500/10 border border-rose-500/20 rounded-sm",
          alertText: "text-rose-400 font-mono text-[10px] uppercase tracking-widest",
          formFieldSuccessText: "text-emerald-400 font-mono text-[9px] uppercase tracking-widest mt-1",
          formFieldWarningText: "text-amber-400 font-mono text-[9px] uppercase tracking-widest mt-1"
        }
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
