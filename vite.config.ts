import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// ----------------------------------------------------------------------

export default defineConfig({
    plugins: [
        react(),
        viteTsconfigPaths(),
        checker({
            eslint: {
                lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
            },
        }),
    ],
    optimizeDeps: {
        esbuildOptions: {
            jsx: 'automatic',
        },
    },
    resolve: {
        alias: [
            {
                find: /^~(.+)/,
                replacement: path.join(process.cwd(), 'node_modules/$1'),
            },
            {
                find: /^src(.+)/,
                replacement: path.join(process.cwd(), 'src/$1'),
            },
        ],
    },
    server: {
        port: 3030,
        hmr: {
            path: 'hmr',
        },
    },
    preview: {
        port: 3030,
    },
});
