import { defineConfig } from 'vite'
import React from '@vitejs/plugin-react'
import VitePluginWasm from 'vite-plugin-wasm';

export default defineConfig({
  root: 'src',
  plugins: [React(), VitePluginWasm()],
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  },
  build:{
    target: "es2022",
   }
})