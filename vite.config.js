import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

console.log('VITE_PORT:', process.env.VITE_PORT);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5001', // Forward API requests to the backend server
    },
  },
});