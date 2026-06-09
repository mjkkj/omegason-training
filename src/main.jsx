import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { useStore } from './store'

// Initialize auth state before rendering
useStore.getState().initialize()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
