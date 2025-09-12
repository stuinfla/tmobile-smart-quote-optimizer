import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppComplete from './AppComplete.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppComplete />
  </StrictMode>,
)