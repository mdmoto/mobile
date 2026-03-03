const fs = require('fs');
const path = require('path');

function replaceRecursive(content) {
    let last;
    do {
        last = content;
        // Replace identifiers or dots before ?.
        content = content.replace(/([\w.\[\]'"$]{2,})\?.(\w+)/g, "($1 && $1.$2)");
    } while (content !== last);

    do {
        last = content;
        content = content.replace(/([\w.\[\]'"$]{2,})\?.\[/g, "($1 && $1[");
    } while (content !== last);

    content = content.replace(/\?\?/g, "||");
    return content;
}

const targetDirs = [
    path.resolve(__dirname, 'node_modules/@noble'),
    path.resolve(__dirname, 'node_modules/@solana'),
    path.resolve(__dirname, 'node_modules/rpc-websockets'),
    path.resolve(__dirname, 'node_modules/superstruct'),
    path.resolve(__dirname, 'node_modules/jayson')
];

function traverse(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (!fullPath.includes('.bin') && !fullPath.includes('node_modules/.cache')) {
                traverse(fullPath);
            }
        } else if (file.endsWith('.js') || file.endsWith('.mjs')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            // Specifically fix PhantomWalletAdapter where regex might break things
            if (fullPath.includes('adapter.js') && fullPath.includes('wallet-adapter-phantom')) {
                content = content.replace(/window\.phantom\?\.solana\?\.isPhantom/g, "(window.phantom && window.phantom.solana && window.phantom.solana.isPhantom)");
                content = content.replace(/window\.solana\?\.isPhantom/g, "(window.solana && window.solana.isPhantom)");
                content = content.replace(/window\.phantom\?\.solana/g, "(window.phantom && window.phantom.solana)");
            }

            let fixed = replaceRecursive(content);

            // Fix static fields
            fixed = fixed.replace(/static instance = null;/g, "");

            if (content !== fixed) {
                console.log(`Fixed: ${fullPath}`);
                fs.writeFileSync(fullPath, fixed, 'utf8');
            }
        }
    });
}

targetDirs.forEach(dir => traverse(dir));
console.log('Final Cleanup complete.');
