import axios from 'axios'

// Todas las peticiones del frontend usan esta instancia
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Hace que el navegador mande la cookie del login en cada petición
  withCredentials: true,
})