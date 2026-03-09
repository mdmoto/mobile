const fs = require('fs');
const path = require('path');

const buildPath = path.resolve(__dirname, 'unpackage/dist/build/web');
const indexPath = path.join(buildPath, 'index.html');

if (!fs.existsSync(indexPath)) {
    console.error('index.html not found at:', indexPath);
    process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// Check if stylesheet link already exists
if (html.includes('<link rel="stylesheet"') || html.includes('<link rel=stylesheet')) {
    console.log('index.html already contains stylesheet links. No fix needed.');
} else {
    console.log('index.html missing stylesheet links. Fixing...');

    const staticPath = path.join(buildPath, 'static');
    if (fs.existsSync(staticPath)) {
        const files = fs.readdirSync(staticPath);
        const cssFiles = files.filter(f => f.endsWith('.css'));

        let cssLinks = '';
        cssFiles.forEach(file => {
            // Prioritize the hashed index.css if multiple exist
            cssLinks += `<link rel="stylesheet" href="/static/${file}">`;
        });

        if (cssLinks) {
            // Insert before <title> or </head>
            if (html.includes('</head>')) {
                html = html.replace('</head>', `${cssLinks}</head>`);
            } else {
                html = html.replace('<title>', `${cssLinks}<title>`);
            }

            fs.writeFileSync(indexPath, html);
            console.log('Added CSS links to index.html:', cssLinks);
        } else {
            console.error('No CSS files found in static/ directory.');
        }
    } else {
        console.error('static/ directory not found.');
    }
}
