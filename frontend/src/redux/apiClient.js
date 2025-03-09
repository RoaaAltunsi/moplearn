import axios from 'axios';

const apiClient = axios.create({
   baseURL: "/api",
   withCredentials: true, // Include cookies in requests
   headers: {
      'Accept': 'application/json',
   },
});

// Fetch CSRF token and set it in the headers
const fetchCsrfToken = async () => {
   try {
      const response = await apiClient.get('/csrf-token');
      apiClient.defaults.headers.common['X-CSRF-TOKEN'] = response.data.csrf_token;
   } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
   }
};

// Fetch CSRF token on initial load
fetchCsrfToken();

// Intercept failed requests to refresh CSRF token if expired
apiClient.interceptors.response.use(
   response => response,
   async (error) => {
      if (error.response?.status === 419) { // CSRF Token Mismatch
         await fetchCsrfToken(); // Get a new token
         return apiClient.request(error.config); // Retry the failed request
      }
      
      return Promise.reject(error);
   }
);

export default apiClient;