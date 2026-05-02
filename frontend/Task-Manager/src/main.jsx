import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import UserProvider from "./context/userContext"
import './index.css'
import App from './App.jsx'
import ThemeProvider from "./context/ThemeContext.jsx"

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <UserProvider>
          <App />
        </UserProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
