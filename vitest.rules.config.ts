import { defineConfig } from 'vitest/config';
import path from 'path';

/**
 * Vitest config for Firestore security rules tests.
 * Requires the Firebase emulator running first:
 *   firebase emulators:start --only firestore
 */
export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        include: ['src/test/firestore.rules.test.ts'],
        testTimeout: 30000,
        hookTimeout: 30000,
    },
    resolve: {
        alias: { '@': path.resolve(__dirname, './src') },
    },
});
