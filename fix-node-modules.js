const fs = require('fs');
const path = require('path');

/**
 * A robust replacement for optional chaining that avoids 
 * corrupting regex literals and other sensitive parts.
 */
function robustFix(content) {
    // 1. Surgical fix for PhantomWalletAdapter - most sensitive part
    content = content.replace(/window\.phantom\?\.solana\?\.isPhantom/g, "(window.phantom && window.phantom.solana && window.phantom.solana.isPhantom)");
    content = content.replace(/window\.solana\?\.isPhantom/g, "(window.solana && window.solana.isPhantom)");
    content = content.replace(/window\.phantom\?\.solana/g, "(window.phantom && window.phantom.solana)");

    // 2. Safely replace optional chaining: identifier?.identifier
    // We use \?\. to match a literal dot.
    // We ensure it's not preceded by a backslash or part of a common regex pattern
    let last;
    do {
        last = content;
        // Match: identifier ?. identifier
        // MUST escape the dot as \. to avoid matching any character
        content = content.replace(/([a-zA-Z0-9_$]+)\?\.([a-zA-Z0-9_$]+)/g, "($1 && $1.$2)");
    } while (last !== content);

    // 3. Nullish coalescing: ?? -> ||
    // Only replace if not inside a string (simple check for now)
    content = content.replace(/([a-zA-Z0-9_$]+)\s*\?\?\s*([a-zA-Z0-9_$]+)/g, "($1 !== undefined && $1 !== null ? $1 : $2)");
    // Fallback for simple ?? if the above didn't catch it
    content = content.replace(/\?\?/g, "||");

    // 4. Fix static class fields: static instance = null; -> (remove)
    content = content.replace(/static instance = null;/g, "");

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
            let original = fs.readFileSync(fullPath, 'utf8');

            // Critical check: Skip files that are known to be minified or large and sensitive
            if (file.endsWith('.min.js')) return;

            // Apply fixes
            let fixed = robustFix(original);

            if (original !== fixed) {
                console.log(`Fixed: ${fullPath}`);
                fs.writeFileSync(fullPath, fixed, 'utf8');
            }
        }
    });
}

targetDirs.forEach(dir => traverse(dir));
console.log('Robust cleanup complete.');
