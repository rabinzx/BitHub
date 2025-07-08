import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import "normalize.css" // CSS reset
import './index.css' // includes tailwindcss
import App from './App.tsx'
import MainCanvas from './pages/MainCanvas.tsx'
import SidePage from './pages/SidePage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import LoginForm from './pages/LoginForm.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} ></Route>
        <Route path="/" element={<App />} >
          <Route index element={<MainCanvas />} />
          <Route path="sidepage" element={<SidePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
