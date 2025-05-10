export interface AuthConfig {
    authority: string;
    redirectUri: string;
    tokenEndpoint: string;
  }
  
  export interface UserInfo {
    sub?: string;
    name?: string;
    email?: string;
    [key: string]: any;
  }
  
  export interface AuthTokens {
    access_token: string;
    id_token?: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
    [key: string]: any;
  }
  
  export interface DecodedToken {
    header: any;
    payload: any;
  }