import Contentstack from 'contentstack';

const api_key = import.meta.env.VITE_CONTENTSTACK_API_KEY;
const delivery_token = import.meta.env.VITE_CONTENTSTACK_DELIVERY_TOKEN;
const environment = import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT;

if (!api_key || !delivery_token || !environment) {
  console.warn('ContentStack environment variables not configured. Using mock data.');
}

const Stack = api_key && delivery_token && environment 
  ? Contentstack.Stack({
      api_key,
      delivery_token,
      environment
    })
  : null;

export default Stack;