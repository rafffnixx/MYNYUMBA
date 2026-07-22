import { build } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildApp() {
  try {
    console.log('🚀 Building Mynyumba for Vercel...');
    
    await build({
      plugins: [react()],
      build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'esbuild',
        rollupOptions: {
          input: path.resolve(__dirname, 'index.html'),
        },
      },
      define: {
        'process.env.VITE_API_URL': JSON.stringify('https://raffcodes.tech/api')
      }
    });
    
    console.log('✅ Build complete!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildApp();