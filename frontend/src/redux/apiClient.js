import axios from 'axios';

const apiClient = axios.create({
   baseURL: "/",
   withCredentials: true, // Include cookies in requests
   headers: {
      'Content-Type': 'application/json',
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

export default apiClient;