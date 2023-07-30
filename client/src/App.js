import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopPage from "./pages/TopPage"
import LoginForm from './pages/LoginForm';
import SignupForm from './pages/SignupForm';
import {AuthProvider} from "./AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
        </Routes>
      </Router>
    </AuthProvider>
    
  );
}

export default App;
