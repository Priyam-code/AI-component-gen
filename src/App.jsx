import React from 'react'
import "./App.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
   
    <>
     =
      <BrowserRouter>
      
        <Routes>
        
          <Route path="/" element={<Home />} />

         
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
        <ToastContainer position="top-right" />
    </>
  )
}

export default App
