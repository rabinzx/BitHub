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
import { Provider } from 'react-redux';
import { store, persistor } from '@/store/store.ts';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} >
              <Route index element={<LoginForm />} />
              <Route path="main" element={<MainCanvas />} />
              <Route path="sidepage" element={<SidePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
