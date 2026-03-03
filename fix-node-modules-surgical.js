const fs = require('fs');
const path = require('path');

const phantomFile = path.resolve(__dirname, 'node_modules/@solana/wallet-adapter-phantom/lib/esm/adapter.js');

if (fs.existsSync(phantomFile)) {
    let content = fs.readFileSync(phantomFile, 'utf8');

    // Surgical fix for the reported lines
    content = content.replace(/window\.phantom\?\.solana\?\.isPhantom/g, "(window.phantom && window.phantom.solana && window.phantom.solana.isPhantom)");
    content = content.replace(/window\.solana\?\.isPhantom/g, "(window.solana && window.solana.isPhantom)");
    content = content.replace(/window\.phantom\?\.solana/g, "(window.phantom && window.phantom.solana)");

    // Other optional chaining and nullish coalescing in this file
    content = content.replace(/error\?\.message/g, "(error && error.message)");
    content = content.replace(/signers\?\.length/g, "(signers && signers.length)");
    content = content.replace(/options\.preflightCommitment\s*\|\|\s*connection\.commitment/g, "options.preflightCommitment || (connection && connection.commitment)");

    fs.writeFileSync(phantomFile, content, 'utf8');
    console.log('Fixed @solana/wallet-adapter-phantom/lib/esm/adapter.js');
}

// Noble hashes fix (scrypt, etc)
const nobleDirs = [
    path.resolve(__dirname, 'node_modules/@noble/curves/ed25519.js'),
    path.resolve(__dirname, 'node_modules/@noble/curves/esm/ed25519.js'),
    path.resolve(__dirname, 'node_modules/@noble/hashes/utils.js'),
    path.resolve(__dirname, 'node_modules/@noble/hashes/esm/utils.js')
];

nobleDirs.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/(\w+)\?.(\w+)/g, "($1 && $1.$2)");
        content = content.replace(/\?\?/g, "||");
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed noble file: ${file}`);
    }
});

console.log('Surgical cleanup complete.');
