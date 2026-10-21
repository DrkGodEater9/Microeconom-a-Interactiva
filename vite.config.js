import { defineConfig } from 'vite';

export default defineConfig({
  // Rutas relativas: el sitio funciona en cualquier carpeta o subruta de un hosting estático.
  base: './',
  build: { target: 'es2022', sourcemap: false },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
  },
});
