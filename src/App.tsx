import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import CallbackPage from './components/CallbackPage';
import Dashboard from './components/Dashboard';
import { AuthConfig, UserInfo, AuthTokens } from './types';
import './App.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [config, setConfig] = useState<AuthConfig>({
    authority: '',
    redirectUri: window.location.origin + '/callback',
    tokenEndpoint: ''
  });

  useEffect(() => {
    console.log("use")
    const accessToken = localStorage.getItem('access_token');
    const userInfoStr = localStorage.getItem('user_info');
    
    if (accessToken) {
      setIsAuthenticated(true);
      if (userInfoStr) {
        try {
          setUserInfo(JSON.parse(userInfoStr));
        } catch (error) {
          console.error('Failed to parse user info', error);
        }
      }
    }
    
    const savedConfig = localStorage.getItem('idp_config');
    console.log(savedConfig)
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Failed to parse saved config', error);
      }
    }
  }, []);

  const handleConfigChange = (newConfig: AuthConfig): void => {
    setConfig(newConfig);
    localStorage.setItem('idp_config', JSON.stringify(newConfig));
  };

  const handleLoginSuccess = (tokens: AuthTokens, user: UserInfo | null): void => {
    setIsAuthenticated(true);
    setUserInfo(user);
  };

  const logout = (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('code_verifier');
    localStorage.removeItem('auth_state');
    setIsAuthenticated(false);
    setUserInfo(null);
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <h1>Identity Provider Tester</h1>
          {isAuthenticated && (
            <button className="logout-button" onClick={logout}>
              Log Out
            </button>
          )}
        </header>
        
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" /> : 
                <LoginPage config={config} onConfigChange={handleConfigChange} />
            } 
          />
          <Route 
            path="/callback" 
            element={
              <CallbackPage 
                onLoginSuccess={handleLoginSuccess} 
              />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
                <Dashboard userInfo={userInfo} config={config} onLogout={logout} /> : 
                <Navigate to="/" />
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;