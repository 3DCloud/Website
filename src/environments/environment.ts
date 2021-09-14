export interface Environment {
  apiUrl: string;
  production: boolean;
}

export const environment: Environment = {
  apiUrl: 'http://localhost:3000',
  production: false,
};
