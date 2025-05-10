import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthConfig, UserInfo, AuthTokens } from '../types';

interface CallbackPageProps {
  onLoginSuccess: (tokens: AuthTokens, user: UserInfo | null) => void;
}

const CallbackPage: React.FC<CallbackPageProps> = ({ onLoginSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [config, setConfig] = useState<AuthConfig>({
    authority: '',
    redirectUri: window.location.origin + '/callback',
    tokenEndpoint: ''
  });

  useEffect(() => {
    async function handleCallback(): Promise<void> {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('authCode');
        
        
        if (!code) {
          throw new Error('No authorization code in response');
        }
        
        localStorage.removeItem('auth_state');
        
        const savedConfig = localStorage.getItem('idp_config');

        let tokenEndpoint = '';

        console.log(savedConfig)
        if (savedConfig) {
          try {
            const parsedConfig = JSON.parse(savedConfig);
            setConfig(parsedConfig);
            tokenEndpoint = parsedConfig.tokenEndpoint
          } catch (error) {
            console.error('Failed to parse saved config', error);
          }
        }

          console.log(tokenEndpoint)
        
          const codeVerifier = localStorage.getItem('code_verifier');
          if (!codeVerifier) {
            // throw new Error('Code verifier not found in storage');
          }
          
          
          localStorage.removeItem('code_verifier');
        
        const tokenResponse = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              authCode: code,
              codeVerifier: codeVerifier
            }),
            credentials: 'include',
          });
        
        if (!tokenResponse.ok) {
          let errorMessage = `Error: ${tokenResponse.status} ${tokenResponse.statusText}`;
          try {
            const errorData = await tokenResponse.json();
            errorMessage = `Error exchanging code for token: ${errorData.error || ''} ${errorData.error_description || ''}`;
          } catch (e) {
          }
          throw new Error(errorMessage);
        }
        
        const tokens: AuthTokens = await tokenResponse.json();
        
        console.log('Token response:', tokens);
        
        localStorage.setItem('access_token', tokens.access_token);
        if (tokens.id_token) {
          localStorage.setItem('id_token', tokens.id_token);
        }
        if (tokens.refresh_token) {
          localStorage.setItem('refresh_token', tokens.refresh_token);
        }
        
        let userInfo: UserInfo | null = null;
        if (tokens.id_token) {
          try {
            const base64Url = tokens.id_token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            userInfo = JSON.parse(window.atob(base64));
          } catch (e) {
            console.warn('Failed to decode id_token', e);
          }
        }
        
        if (!userInfo && tokens.access_token) {
          try {
            const userinfoEndpoint = 
              config.authority + (config.authority.endsWith('/') ? 'userinfo' : '/userinfo');
            
            const userInfoResponse = await fetch(userinfoEndpoint, {
              headers: {
                'Authorization': `Bearer ${tokens.access_token}`
              }
            });
            
            if (userInfoResponse.ok) {
              userInfo = await userInfoResponse.json();
            }
          } catch (e) {
            console.warn('Failed to fetch user information', e);
          }
        }
        
        if (userInfo) {
          localStorage.setItem('user_info', JSON.stringify(userInfo));
        }
        
        onLoginSuccess(tokens, userInfo);
        
        navigate('/dashboard');
      } catch (error) {
        console.error('Error during authentication callback:', error);
        setError(error instanceof Error ? error.message : String(error));
        setProcessing(false);
      }
    }
    
    handleCallback();
  }, [location.search, navigate, onLoginSuccess]);

  if (error) {
    return (
      <div className="callback-error">
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Return to Login</button>
      </div>
    );
  }

  return (
    <div className="callback-processing">
      <h2>Processing Authentication Response...</h2>
      <div className="loader"></div>
    </div>
  );
};

export default CallbackPage;