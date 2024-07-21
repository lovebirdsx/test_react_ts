// A tiny wrapper around fetch(), borrowed from
// https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper

interface CustomConfig {
  body?: any;
  headers?: Record<string, string>;
  method?: string;
  [key: string]: any;
}

export async function client(endpoint: string, { body, ...customConfig }: CustomConfig = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let data: any;
  try {
    const response = await window.fetch(endpoint, config);
    data = await response.json();
    if (response.ok) {
      // Return a result object similar to Axios
      return {
        status: response.status,
        data,
        headers: response.headers,
        url: response.url,
      };
    }
    throw new Error(response.statusText);
  } catch (err: any) {
    return Promise.reject(err.message ? err.message : data);
  }
}

client.get = (endpoint: string, customConfig: CustomConfig = {}) => {
  return client(endpoint, { ...customConfig, method: 'GET' });
};

client.post = (endpoint: string, body: any, customConfig: CustomConfig = {}) => {
  return client(endpoint, { ...customConfig, body });
};
