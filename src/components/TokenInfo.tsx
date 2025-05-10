import React, { useState } from 'react';
import { DecodedToken } from '../types';

interface TokenInfoProps {
  title: string;
  token: string;
  description: string;
}

const TokenInfo: React.FC<TokenInfoProps> = ({ title, token, description }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  
  const getDecodedToken = (): DecodedToken | null => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      return { header, payload };
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  };
  
  const decodedToken = getDecodedToken();

  return (
    <div className="token-info">
      <div className="token-header" onClick={() => setExpanded(!expanded)}>
        <h4>{title}</h4>
        <span className={`expand-icon ${expanded ? 'expanded' : ''}`}>▼</span>
      </div>
      
      {expanded && (
        <div className="token-details">
          <p>{description}</p>
          
          <div className="token-value">
            <h5>Token (raw):</h5>
            <div className="token-raw">
              {token}
            </div>
          </div>
          
          {decodedToken && (
            <div className="token-decoded">
              <h5>Decoded header:</h5>
              <pre>{JSON.stringify(decodedToken.header, null, 2)}</pre>
              
              <h5>Decoded payload:</h5>
              <pre>{JSON.stringify(decodedToken.payload, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TokenInfo;