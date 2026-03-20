import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import path from 'path';

export default defineConfig({
    define: { "__MAOMALL_BUILD_ID__": "1773966479" }, plugins: [
        uni(),
    ],
    resolve: {
        alias: [
            { find: '@', replacement: path.resolve(__dirname, './src') },
            { find: /^rpc-websockets\/dist\/lib\/client$/, replacement: path.resolve(__dirname, 'node_modules/rpc-websockets/dist/lib/client.js') },
            { find: 'rpc-websockets/dist/lib/client/websocket.browser', replacement: path.resolve(__dirname, 'node_modules/rpc-websockets/dist/lib/client/websocket.browser.js') },
            { find: 'rpc-websockets/dist/lib/client/websocket', replacement: path.resolve(__dirname, 'node_modules/rpc-websockets/dist/lib/client/websocket.js') },
        ],
    },
    optimizeDeps: {
        include: ['buffer', 'process', 'uview-plus'],
    },
});
