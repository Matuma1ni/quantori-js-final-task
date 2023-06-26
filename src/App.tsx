import React from "react"
import "./App.css"
import backgroundImage from "./assets/mainBackground.png"
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom"
import { InitialPage } from "./pages/InitialPage"
import { NotFoundPage } from "./pages/NotFoundPage"
import { Header } from "./components/Header"
import { AuthPage } from "./pages/AuthPage"
import { SearchPage } from "./pages/SearchPage"
import { ProteinPage } from "./pages/ProteinPage"
import { QueryClient } from "@tanstack/query-core"
import { QueryClientProvider } from "@tanstack/react-query"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "./authConfig"

const queryClient = new QueryClient();

const App = () => {

  const [user, loading] = useAuthState(auth);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {!user && !loading &&
            <Routes>
              <Route path="/" element={<AuthLayout />}>
                <Route path="/" element={<InitialPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Route>
            </Routes>
          }
          {user && !loading &&
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route path="/auth" element={<Navigate to="/search"/>}/>
                <Route path="/" element={<Navigate to="/search" />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/protein/:id" element={<ProteinPage />} />
                <Route path="/not-found" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/not-found" />} />
              </Route>
            </Routes>
          }
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode >
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
