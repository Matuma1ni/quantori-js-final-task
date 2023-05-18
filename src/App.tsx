import React from "react"
import "./App.css"
import backgroundImage from "./assets/mainBackground.png"
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom"
import { InitialPage } from "./pages/InitialPage"
import { NotFoundPage } from "./pages/NotFoundPage"
import { Header } from "./components/Header"
import { AuthPage } from "./pages/AuthPage"

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout/>}>
            <Route path="/" element={<InitialPage />} /> 
            <Route path="/auth" element={<AuthPage />} /> 
          </Route>      
          <Route path="/" element={<MainLayout/>}>
            <Route path="/not-found" element={<NotFoundPage />} /> 
            <Route path="*" element={<Navigate to="/not-found" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  )
}

function MainLayout() {
  return (
    <>
      <Header />
      <Outlet /> 
    </>
  );
}

function AuthLayout() {
  return (
    <div className="background" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Outlet />
    </div>

  )
}
export default App
