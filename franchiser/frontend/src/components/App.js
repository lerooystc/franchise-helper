import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import News from "./News";
import Navigation from "./Navigation";
import Login from "./Login";
import Register from "./Register";
import { Box } from '@mui/material';
import { withRouter } from "../withRouter";
import { Dashboard } from "./Dashboard";
import Partner from "./Partner";
import { Location } from "./Location";
import { Contractor } from "./Contractor";
import { TaskPage } from "./TaskPage";
import { AuthProvider } from "./AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/de';

const App = () => {
  return (
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
        <Router>
          <Navigation />
          <Box sx={{ height: '90%' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/tasks" element={<ProtectedRoute><TaskPage /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/partner/:id" element={<ProtectedRoute><Partner /></ProtectedRoute>} />
              <Route path="/location/:id" element={<ProtectedRoute><Location /></ProtectedRoute>} />
              <Route path="/contractor/:id" element={<ProtectedRoute><Contractor /></ProtectedRoute>} />
              <Route path="/news/:page" element={<News />} />
            </Routes>
          </Box>
        </Router>
      </LocalizationProvider>
    </AuthProvider>
  )
}


export default withRouter(App);
const appDiv = document.getElementById("app");
const root = createRoot(appDiv);
root.render(<App />);