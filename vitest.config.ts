/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'dist/',
        'coverage/'
      ],
      thresholds: {
        global: {
          functions: 80,
          lines: 80,
          statements: 80,
          branches: 70
        }
      }
    },
    
    // PhoneGuard specific optimizations
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true, // Better for smaller projects
        minThreads: 1,
        maxThreads: 4
      }
    },
    
    // Test file patterns
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules/', 'dist/', '.idea/', '.git/', '.cache/'],
    
    // Timeout configuration
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Reporter configuration
    reporters: ['verbose'],
    outputFile: {
      json: './coverage/test-results.json',
      html: './coverage/test-results.html'
    }
  },
  
  // Resolve aliases to match your main Vite config
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/data': path.resolve(__dirname, './src/data'),
      '@/test': path.resolve(__dirname, './src/test')
    }
  }
}) 