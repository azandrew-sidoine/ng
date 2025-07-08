declare var process: {
  env: Record<string, any>;
};

/**
 * Returns an e environment variable value
 *
 * @param name
 */
export const env = (name: string, d: unknown = undefined) => {
  const value = process.env[name];
  // When environment variable is not set resolver might return empty string
  // Therefore we fallback to the default value whenever an empty string is returned
  // We check for undefined and null value in order to not return default value if false is provided
  // through environment variables
  return typeof value !== 'undefined' && value !== null
    ? String(value).trim() !== ''
      ? value
      : d
    : d;
};

export const environment = {
  version: env('APP_VERSION'),
  production:
    `${env('APP_ENV', 'production')}`.toLocaleLowerCase() === 'production',
  // Application logo path
  logo: env('APP_LOGO', '/assets/media/logo.png'),

  // Application name environment value
  name: env('APP_NAME', 'Angular App'),
  api: {
    host: `${env('API_URL')}/api/v2`,
    // HTTP API endpoints environment configuration
    endpoints: {},
  },

  // TODO: Uncomment the code below to add form configuration values
  // form: {
  //   assets: `${env('FORM_ASSETS', '/assets/forms.json')}`
  // },

  // TODO: Uncomment the code below to provide upload url configuration
  // upload: {
  //   url: `${env('UPLOAD_URL')}`
  // },

  // TODO: Uncomment the code below to change the view ui layout
  ui: {
    layout: `${env('UI_LAYOUT', 'default')}`,
    telphone: {
      countries: {
        supported: `${env('UI_TEL_SUPPORTED_COUNTRIES', 'tg,bj,gh,ci')}`
          .split(',')
          .map((x) => x.trim()),
        preferred: `${env('UI_TEL_PREFERED_COUNTRIES', 'tg')}`
          .split(',')
          .map((x) => x.trim()),
      },
    },
  },

  // #TODO: Add authentication configuration if required
  // auth: {
  //   local: {
  //     host: `${env('AUTH_URL')}`,
  //     clients: {
  //       id: `${env('AUTH_CLIENT')}`,
  //       secret: `${env('AUTH_CLIENT_TOKEN')}`,
  //     },
  //   },
  //   redirect: {
  //     url: `${env('REDIRECT_URL', '/auth/login')}`,
  //   },
  // },

  // #TODO: Uncomment code below to add configuration for secure storage module
  // storage: {
  //   secret: `${env('STORAGE_SECRET')}`,
  //   prefix: `${env('STORAGE_PREFIX')}`,
  // },
};
