import '@unocss/reset/tailwind-compat.css'
import '@radix-ui/themes/styles.css'
import 'virtual:uno.css'
import '@/assets/fonts/font.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import './monaco'

import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Theme accentColor="violet" appearance="dark" className="w-screen h-screen bg-slate-900" radius="large">
      <App />
    </Theme>
  </React.StrictMode>,
)
