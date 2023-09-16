import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "../components/Home";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";
import PrivateRoute from "./PrivateRoute";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRouter;
