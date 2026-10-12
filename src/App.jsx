import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactLenis from "lenis/react";

import Home from "./pages/Home";
import ProjectDetails from "./pages/ProjectDetails";
import ProjectRequest from "./pages/ProjectRequest";
import ScrollToTop from "./components/ScrollToTop";
import Chatbot from "./components/Chatbot";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <ReactLenis root className="relative w-screen min-h-screen overflow-x-hidden" style={{ position: "relative" }}>
      <div className="min-h-screen">
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:slug" element={<ProjectDetails />} />
            <Route path="/start" element={<ProjectRequest />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
          <Chatbot />
        </Router>
      </div>
    </ReactLenis>
  );
};

export default App;
