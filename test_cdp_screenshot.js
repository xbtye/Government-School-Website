const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function main() {
    const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
    const port = 9222;
    const browser = spawn(edgePath, [
        '--headless=new',
        `--remote-debugging-port=${port}`,
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check'
    ]);

    await new Promise(r => setTimeout(r, 1200));

    try {
        const versionData = await new Promise((resolve, reject) => {
            http.get(`http://127.0.0.1:${port}/json/version`, res => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(JSON.parse(data)));
            }).on('error', reject);
        });

        const wsUrl = versionData.webSocketDebuggerUrl;
        console.log('Connected to Chrome DevTools Protocol:', wsUrl);

        // Simple CDP client over WebSocket
        // If 'ws' is not installed, we can check
    } catch (e) {
        console.error('CDP Error:', e.message);
    } finally {
        browser.kill();
    }
}
main();
