import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Navigation from "./Navigation";
import Login from "./Login";
import Register from "./Register";
import { Box } from '@mui/material';
import { logout_user } from '../network';

export default class App extends Component {
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
      });
    }, 1000);
  }

  handleLogout = () => {
    logout_user();
    this.setState({
      token: undefined,
    });
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      this.handleLogin();
    };
  }

  render() {
    console.log(this.token);
    return (
      <>
        <Router>
          <Navigation token={this.token} onLogout={this.handleLogout} />
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>


            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Box>
        </Router>
      </>
    )
  }
}

const appDiv = document.getElementById("app");
const root = createRoot(appDiv);
root.render(<App />);