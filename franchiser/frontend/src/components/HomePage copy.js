import React, { Component } from "react";
import Login from './Login';
import Register from './Register';
import { BrowserRouter as Router, Routes, Route, Link, Redirect } from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<h1>Test</h1>}>
          </Route>
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Register} />
        </Routes>
      </Router>
    );
  }
}