import React from "react"
import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { InitialPage } from "./pages/InitialPage"

const App = () => {
  return (

    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InitialPage />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  )
}

export default App
