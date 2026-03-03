const fs = require('fs');
const path = require('path');

/**
 * A more stable replacement for optional chaining.
 * Instead of recursive nesting which breaks parentheses in HBuilder/Babel,
 * we use a simpler approach for standard identifiers.
 */
function stableFix(content) {
    // 1. First, handle the most complex nested cases surgically to avoid regex madness
    content = content.replace(/window\.phantom\?\.solana\?\.isPhantom/g, "(window.phantom && window.phantom.solana && window.phantom.solana.isPhantom)");
    content = content.replace(/window\.solana\?\.isPhantom/g, "(window.solana && window.solana.isPhantom)");
    content = content.replace(/window\.phantom\?\.solana/g, "(window.phantom && window.phantom.solana)");

    // 2. Simple conversion for standard single-level optional chaining: a?.b -> (a && a.b)
    // We avoid matching if there are already parentheses to prevent nesting errors
    let last;
    do {
        last = content;
        // Match: identifier ?. identifier (avoiding parentheses)
        content = content.replace(/([a-zA-Z0-9_$]+)\?\.([a-zA-Z0-9_$]+)/g, "($1 && $1.$2)");
        // Match: expr) ?. identifier
        content = content.replace(/([a-zA-Z0-9_$]+\))\?\.([a-zA-Z0-9_$]+)/g, "($1 && $1.$2)");
    } while (last !== content);

    // 3. Nullish coalescing: ?? -> ||
    content = content.replace(/\?\?/g, "||");

    // 4. Clean up the messy line produced by the previous failed attempt
    content = content.replace(/\(window\.phantom && \(window\.phantom\.solana\) && window\.phantom\.solana\)\.isPhantom\) \|\| \(window\.solana && window\.solana\.isPhantom\)/g,
        "(window.phantom && window.phantom.solana && window.phantom.solana.isPhantom) || (window.solana && window.solana.isPhantom)");

    // 5. Fix class fields
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
            let fixed = stableFix(original);
            if (original !== fixed) {
                console.log(`Fixed: ${fullPath}`);
                fs.writeFileSync(fullPath, fixed, 'utf8');
            }
        }
    });
}

targetDirs.forEach(dir => traverse(dir));
console.log('Stable cleanup complete.');
