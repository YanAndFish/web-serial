import '@unocss/reset/tailwind-compat.css'
import '@radix-ui/themes/styles.css'
import 'virtual:uno.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Theme appearance="dark" className="w-screen h-screen" accentColor="violet" radius="large">
      <App />
    </Theme>
  </React.StrictMode>,
)
