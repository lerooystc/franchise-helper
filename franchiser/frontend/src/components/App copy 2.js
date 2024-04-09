import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./HomePage";
import Navigation from "./Navigation";
import Login from "./Login";
import Register from "./Register";
import { Box } from '@mui/material';
import { logout_user } from '../network';
import { withRouter } from "../withRouter";
import Dashboard from "./Dashboard";
import Partner from "./Partner";

export const AuthContext = React.createContext(null);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: undefined,
    }
  }

  handleLogin = () => {
    setTimeout(() => {
      this.setState({
        token: localStorage.getItem('token'),
      })
    }, 1000)
  }

  handleLogout = () => {
    logout_user();
    this.setState({
      token: undefined,
    });
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      this.setState({
        token: localStorage.getItem('token'),
      })
    };
  }

  render() {
    return (
      
        <AuthContext.Provider value={this.state.token}>
          <Router>
            <Navigation onLogout={this.handleLogout} />
            <Box sx={{ height: '100%' }}>


              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login onLogin={this.handleLogin} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/partner/:id" element={<Partner />}></Route>
              </Routes>
            </Box>
          </Router>
        </AuthContext.Provider>
  
    )
  }
}


export default withRouter(App);
const appDiv = document.getElementById("app");
const root = createRoot(appDiv);
root.render(<App />);