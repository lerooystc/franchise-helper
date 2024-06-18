import React, { useEffect, useContext } from "react";
import { login_account, logout_user } from '../network';

const AuthContext = React.createContext(null);
const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = React.useState(undefined);
  const [loaded, setLoaded] = React.useState(false);

  const handleLogin = async (login, password) => {
    const data = await login_account(login, password);
    if (data) {
      localStorage.setItem("token", data);
      setToken(data);
      return true;
    }
    else return false;
  }

  const handleLogout = () => {
    (async () => {
      await logout_user();
      localStorage.removeItem("token");
      setToken(undefined);
    })();

    return () => {
    };
  }

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setLoaded(true);
  })

  const value = {
    token,
    loaded,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuthContext };