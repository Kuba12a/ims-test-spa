import React, { useState, useEffect } from 'react';
import ConfigForm from './ConfigForm';
import { AuthConfig } from '../types';
import { generateCodeVerifier, generateCodeChallenge } from '../utils/pkce';

interface LoginPageProps {
    config: AuthConfig;
    onConfigChange: (config: AuthConfig) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ config, onConfigChange }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [configLoaded, setConfigLoaded] = useState<boolean>(false);

    useEffect(() => {
        setConfigLoaded(true);

        console.log('LoginPage received config:', config);
    }, [config]);

    const initiateLogin = async (): Promise<void> => {
        setLoading(true);

        try {
            if (!config.authority) {
                throw new Error('Authority URL is required');
            }

            const authUrl = new URL(config.authority);

            authUrl.searchParams.append('redirectUri', config.redirectUri);


            const codeVerifier = await generateCodeVerifier();
            localStorage.setItem('code_verifier', codeVerifier);

            const codeChallenge = await generateCodeChallenge(codeVerifier);
            localStorage.setItem('code_challenge', codeChallenge);

            authUrl.searchParams.append('codeChallenge', codeChallenge);

            localStorage.setItem('idp_config', JSON.stringify(config));

            window.location.assign(authUrl.toString());
        } catch (error) {
            console.error('Error during login initiation:', error);
            alert(error instanceof Error ? error.message : 'Failed to initiate login');
            setLoading(false);
        }
    };

    if (!configLoaded) {
        return (
            <div className="login-container">
                <h2>Loading Configuration...</h2>
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <h2>Configuration and Login</h2>

            <ConfigForm
                config={config}
                onConfigChange={onConfigChange}
            />

            <div className="buttons-container">
                <button
                    className="login-button"
                    onClick={initiateLogin}
                    disabled={loading || !config.authority}
                >
                    {loading ? 'Redirecting...' : 'Login'}
                </button>
            </div>
        </div>
    );
};

export default LoginPage;