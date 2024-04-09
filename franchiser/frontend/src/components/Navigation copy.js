import React, { Component } from "react";
import { NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/">Dashboard</NavLink>
      </nav>
    );
}

export default Navigation;