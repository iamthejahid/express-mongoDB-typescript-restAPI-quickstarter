import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        env: {
            JWT_ACCESS_SECRET: 'test-access',
            JWT_REFRESH_SECRET: 'test-refresh',
            JWT_BASIC_USER: 'test-client',
            JWT_BASIC_SECRET: 'test-client',
            USER_VERIFICATION_TOKEN_SECRET: 'test-verification',
            JWT_ACCESS_EXPIRATION_MINUTES: '15',
            JWT_REFRESH_EXPIRATION_MINUTES: '30',
        },
    },
    resolve: {
        alias: {
            '@main': path.resolve(__dirname, './src'),
        },
    },
});
