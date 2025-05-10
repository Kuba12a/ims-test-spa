import React from 'react';
import { AuthConfig } from '../types';

interface ConfigFormProps {
  config: AuthConfig;
  onConfigChange: (config: AuthConfig) => void;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ config, onConfigChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      onConfigChange({
        ...config,
        [name]: checked
      });
    } else {
      onConfigChange({
        ...config,
        [name]: value
      });
    }
  };

  return (
    <div className="config-form">
      <div className="form-group">
        <label>Authority URL (Your IdP URL):</label>
        <input
          type="text"
          name="authority"
          value={config.authority}
          onChange={handleChange}
          placeholder="https://your-idp.com/"
        />
      </div>
      
      <div className="form-group">
        <label>Token Endpoint (optional, if different from standard):</label>
        <input
          type="text"
          name="tokenEndpoint"
          value={config.tokenEndpoint || ''}
          onChange={handleChange}
          placeholder="https://your-idp.com/token"
        />
      </div>
      
      <div className="form-group">
        <label>Redirect URI:</label>
        <input
          type="text"
          name="redirectUri"
          value={config.redirectUri}
          onChange={handleChange}
          disabled
        />
      </div>
      
    </div>
  );
};

export default ConfigForm;