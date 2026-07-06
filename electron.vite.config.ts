import { resolve } from 'path'
import { defineConfig, loadEnv } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log('VITE_APP_NAME:', env.VITE_APP_NAME)
  return {
    main: {},
    preload: {},
    renderer: {
      resolve: {
        alias: {
          '@': resolve('src/renderer/src')
        },
        extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
      },
      plugins: [react(), tailwindcss()],
      server: {
        host: true,
        port: env.PORT ? Number(env.PORT) : 5174
      }
    }
  }
})
