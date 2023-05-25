import React from "react"
import "./App.css"
import backgroundImage from "./assets/mainBackground.png"
import { BrowserRouter, Navigate, Outlet, Route, Routes} from "react-router-dom"
import { InitialPage } from "./pages/InitialPage"
import { NotFoundPage } from "./pages/NotFoundPage"
import { Header } from "./components/Header"
import { AuthPage } from "./pages/AuthPage"
import { AuthRoute } from "./components/AuthRoute"
import { NotAuthRoute } from "./components/NotAuthRoute"
import { SearchPage } from "./pages/SearchPage"
import { ProteinPage } from "./pages/ProteinPage"


const App = () => {

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path="/" element={<NotAuthRoute><InitialPage /></NotAuthRoute>} />
            <Route path="/auth" element={<NotAuthRoute><AuthPage /></NotAuthRoute>} />
          </Route>
          <Route path="/" element={<MainLayout />}>
            <Route path="/search" element={<AuthRoute><SearchPage /></AuthRoute>} />
            <Route path="/polymer/:id" element={<AuthRoute><ProteinPage /></AuthRoute>} />
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
