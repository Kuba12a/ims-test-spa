import React, { useState } from 'react';
import TokenInfo from './TokenInfo';
import { AuthConfig, UserInfo } from '../types';

interface DashboardProps {
  userInfo: UserInfo | null;
  config: AuthConfig;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userInfo, onLogout, config }) => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  
  const accessToken = localStorage.getItem('access_token');
  const idToken = localStorage.getItem('id_token');
  const refreshToken = localStorage.getItem('refresh_token');

  return (
    <div className="dashboard-container">
      <h2>User Dashboard</h2>
      
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'profile' ? 'active' : ''} 
          onClick={() => setActiveTab('profile')}
        >
          User Profile
        </button>
        <button 
          className={activeTab === 'tokens' ? 'active' : ''} 
          onClick={() => setActiveTab('tokens')}
        >
          Tokens
        </button>
        <button 
          className={activeTab === 'config' ? 'active' : ''} 
          onClick={() => setActiveTab('config')}
        >
          Configuration
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h3>User Data</h3>
            {userInfo ? (
              <div className="user-info">
                {userInfo.name && (
                  <div className="info-item">
                    <span className="label">Name:</span>
                    <span className="value">{userInfo.name}</span>
                  </div>
                )}
                {userInfo.email && (
                  <div className="info-item">
                    <span className="label">Email:</span>
                    <span className="value">{userInfo.email}</span>
                  </div>
                )}
                {userInfo.sub && (
                  <div className="info-item">
                    <span className="label">Subject ID:</span>
                    <span className="value">{userInfo.sub}</span>
                  </div>
                )}
                
                <h4>All Data:</h4>
                <pre>{JSON.stringify(userInfo, null, 2)}</pre>
              </div>
            ) : (
              <p>No user data available</p>
            )}
          </div>
        )}
        
        {activeTab === 'tokens' && (
          <div className="tokens-section">
            <h3>Tokens</h3>
            
            {accessToken && (
              <TokenInfo 
                title="Access Token" 
                token={accessToken}
                description="Token used to access protected resources"
              />
            )}
            
            {idToken && (
              <TokenInfo 
                title="ID Token" 
                token={idToken}
                description="Token containing user identity information"
              />
            )}
            
            {refreshToken && (
              <TokenInfo 
                title="Refresh Token" 
                token={refreshToken}
                description="Token used to refresh the access token"
              />
            )}
            
            {!accessToken && !idToken && !refreshToken && (
              <p>No tokens available</p>
            )}
          </div>
        )}
        
        {activeTab === 'config' && (
          <div className="config-section">
            <h3>Identity Provider Configuration</h3>
            <pre>{JSON.stringify(config, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;