// Конфігурація Auth0
export const auth0Config = {
  domain: "dev-rycuhbhc34tcpfor.us.auth0.com",
  clientId: "vfejFtpy85i0tIVtFycc31RDUfx5Jyy7",
  redirectUri: "http://localhost:8082",
  // Додаткові налаштування, якщо потрібно
  audience: undefined,
  scope: "openid profile email",
  // Увімкнути тестовий режим для локальної розробки
  useRefreshTokens: true,
  cacheLocation: "localstorage",
}; 