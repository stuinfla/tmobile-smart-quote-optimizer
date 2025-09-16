import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/global-input-fixes.css'
import AppComplete from './AppComplete.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppComplete />
  </StrictMode>,
)